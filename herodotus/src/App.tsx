import React, { useState, useMemo, useEffect, useCallback } from 'react';
import rawMonumentsData from './data/monuments.json';
import { Monument, Circuit } from './types/monument';
import { Header } from './components/Header/Header';
import { SearchBar } from './components/Discovery/SearchBar';
import { CircuitSelector } from './components/Discovery/CircuitSelector';
import { MapView, MapLayerType } from './components/Map/MapView';
import { PlaceSheet } from './components/PlaceSheet/PlaceSheet';
import {
  initSpeechEngine,
  playNarration,
  pauseNarration,
  resumeNarration,
  stopNarration,
  PlaybackState,
  SpeechLanguage,
} from './lib/speech';
import { calculateDistanceKm, formatCoordinates, LatLng } from './lib/haversine';
import { searchMonuments } from './lib/search';

export function App() {
  const monuments = rawMonumentsData as Monument[];

  // Core Application State
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);
  const [isPlaceSheetOpen, setIsPlaceSheetOpen] = useState<boolean>(true);
  const [currentLayer, setCurrentLayer] = useState<MapLayerType>('google_terrain');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCircuit, setActiveCircuit] = useState<Circuit | null>(null);
  const [isCircuitsModalOpen, setIsCircuitsModalOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SpeechLanguage>('en');
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  // Geolocation state
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Initialize Speech Engine & Voice Cache on Mount
  useEffect(() => {
    initSpeechEngine();
  }, []);

  // Default selection on load
  useEffect(() => {
    if (monuments.length > 0 && !selectedMonument) {
      setSelectedMonument(monuments[0]);
      setIsPlaceSheetOpen(true);
    }
  }, [monuments, selectedMonument]);

  // Request user geolocation
  const handleLocateNearMe = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Unable to determine your GPS location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Showing monuments in default order.';
        }
        console.warn(msg, err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  // Filtered & Distance-Sorted Monuments Dataset
  const filteredMonuments = useMemo(() => {
    let result = monuments;

    // 1. Curated Circuit filter
    if (activeCircuit) {
      result = result.filter((m) => activeCircuit.monumentIds.includes(m.id));
    }

    // 2. Category filter
    if (selectedCategory === 'unesco') {
      result = result.filter((m) => m.unesco);
    } else if (selectedCategory === 'Tombs & Mosques') {
      result = result.filter(
        (m) => m.category === 'Tomb & Mausoleum' || m.category === 'Mosque'
      );
    } else if (selectedCategory !== 'all') {
      result = result.filter((m) => m.category === selectedCategory);
    }

    // 3. Multi-field fuzzy search (diacritic & script insensitive)
    if (searchQuery.trim()) {
      result = searchMonuments(result, searchQuery);
    }

    // 4. Geolocation Great-Circle distance sorting ("Near Me")
    if (userLocation) {
      result = [...result].sort((a, b) => {
        const distA = calculateDistanceKm(userLocation, a.coordinates);
        const distB = calculateDistanceKm(userLocation, b.coordinates);
        return distA - distB;
      });
    }

    return result;
  }, [monuments, activeCircuit, selectedCategory, searchQuery, userLocation]);

  // Handle Audio Narration Toggle (Play / Pause / Resume)
  const handleToggleAudio = useCallback(() => {
    if (!selectedMonument) return;

    if (playbackState === 'playing') {
      pauseNarration({ onStateChange: setPlaybackState });
    } else if (playbackState === 'paused') {
      resumeNarration({ onStateChange: setPlaybackState });
    } else {
      const audioData =
        selectedMonument.audioNarrations[selectedLanguage] ||
        selectedMonument.audioNarrations.en;

      playNarration(audioData.narrationText, selectedLanguage, playbackRate, {
        onStateChange: setPlaybackState,
        onError: (err) => console.error(err),
      });
    }
  }, [selectedMonument, playbackState, selectedLanguage, playbackRate]);

  const handlePauseAudio = useCallback(() => {
    pauseNarration({ onStateChange: setPlaybackState });
  }, []);

  const handleResumeAudio = useCallback(() => {
    resumeNarration({ onStateChange: setPlaybackState });
  }, []);

  const handleStopAudio = useCallback(() => {
    stopNarration({ onStateChange: setPlaybackState });
  }, []);

  const handleRateChange = useCallback(
    (rate: number) => {
      setPlaybackRate(rate);
      if (playbackState === 'playing' && selectedMonument) {
        const audioData =
          selectedMonument.audioNarrations[selectedLanguage] ||
          selectedMonument.audioNarrations.en;
        playNarration(audioData.narrationText, selectedLanguage, rate, {
          onStateChange: setPlaybackState,
          onError: (err) => console.error(err),
        });
      }
    },
    [playbackState, selectedMonument, selectedLanguage]
  );

  const handleLanguageChange = useCallback(
    (lang: SpeechLanguage) => {
      setSelectedLanguage(lang);
      if (playbackState === 'playing' && selectedMonument) {
        const audioData =
          selectedMonument.audioNarrations[lang] || selectedMonument.audioNarrations.en;
        playNarration(audioData.narrationText, lang, playbackRate, {
          onStateChange: setPlaybackState,
          onError: (err) => console.error(err),
        });
      }
    },
    [playbackState, selectedMonument, playbackRate]
  );

  // Switch monument selection cleanly
  const handleSelectMonument = useCallback(
    (monument: Monument) => {
      setSelectedMonument(monument);
      setIsPlaceSheetOpen(true);
      if (playbackState === 'playing' || playbackState === 'paused') {
        stopNarration({ onStateChange: setPlaybackState });
      }
    },
    [playbackState]
  );

  // Distance to currently selected monument
  const selectedDistanceKm = useMemo(() => {
    if (!selectedMonument || !userLocation) return undefined;
    return calculateDistanceKm(userLocation, selectedMonument.coordinates);
  }, [selectedMonument, userLocation]);

  // Formatted GPS telemetry text
  const userCoordsText = useMemo(() => {
    if (!userLocation) return null;
    return formatCoordinates(userLocation.lat, userLocation.lng);
  }, [userLocation]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#E5E3DF]">
      {/* Top Header Controls (Circuits, Language, User profile) */}
      <Header
        monumentCount={monuments.length}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onOpenCircuits={() => setIsCircuitsModalOpen(true)}
        activeCircuitName={activeCircuit ? activeCircuit.name : null}
        onClearCircuit={() => setActiveCircuit(null)}
        userCoordsText={userCoordsText}
      />

      {/* Google Maps Search Bar & Filter Chips */}
      <div className={`transition-all duration-200 ${isPlaceSheetOpen ? 'hidden sm:block sm:left-[432px]' : ''}`}>
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onLocateNearMe={handleLocateNearMe}
          isLocating={isLocating}
          nearMeActive={!!userLocation}
          monuments={monuments}
          resultCount={filteredMonuments.length}
          onOpenCircuits={() => setIsCircuitsModalOpen(true)}
        />
      </div>

      {/* Main Full-Bleed Map Canvas with Google Maps Vector / Terrain tiles */}
      <MapView
        monuments={filteredMonuments}
        selectedMonument={selectedMonument}
        onSelectMonument={handleSelectMonument}
        userLocation={userLocation}
        activeCircuitId={activeCircuit ? activeCircuit.id : null}
        currentLayer={currentLayer}
        onLayerChange={setCurrentLayer}
        onLocateUser={handleLocateNearMe}
      />

      {/* Google Maps Authentic Left Sidebar Place Sheet (Matching User's Image 1) */}
      {selectedMonument && (
        <PlaceSheet
          monument={selectedMonument}
          isOpen={isPlaceSheetOpen}
          onClose={() => {
            setIsPlaceSheetOpen(false);
            if (playbackState === 'playing' || playbackState === 'paused') {
              handleStopAudio();
            }
          }}
          playbackState={playbackState}
          onPlayNarration={handleToggleAudio}
          onPauseNarration={handlePauseAudio}
          onResumeNarration={handleResumeAudio}
          onStopNarration={handleStopAudio}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={handleLanguageChange}
          playbackRate={playbackRate}
          onSelectRate={handleRateChange}
          distanceKm={selectedDistanceKm}
        />
      )}

      {/* Curated Heritage Circuits Modal */}
      <CircuitSelector
        isOpen={isCircuitsModalOpen}
        onClose={() => setIsCircuitsModalOpen(false)}
        onSelectCircuit={(circuit) => {
          setActiveCircuit(circuit);
          const firstInCircuit = monuments.find((m) => circuit.monumentIds.includes(m.id));
          if (firstInCircuit) {
            handleSelectMonument(firstInCircuit);
          }
        }}
        onClearCircuit={() => setActiveCircuit(null)}
        activeCircuitId={activeCircuit ? activeCircuit.id : null}
      />
    </div>
  );
}

export default App;
