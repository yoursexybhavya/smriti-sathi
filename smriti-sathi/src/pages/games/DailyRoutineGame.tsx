import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, CheckCircle, RotateCcw, ArrowRight, Sun, Coffee, Pill, Footprints, Moon, Utensils, Bed } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useVoice } from '../../hooks/useVoice';
import { GameSession } from '../../models/GameSession';
import { GameStorage } from '../../services/storage/GameStorage';
import LargeButton from '../../components/LargeButton';
import ProgressCard from '../../components/ProgressCard';

interface DailyRoutineGameProps {
  onBack: () => void;
}

interface RoutineItem {
  id: string;
  name: string;
  period: string;
  order: number;
  iconName: 'sun' | 'coffee' | 'pill' | 'walk' | 'lunch' | 'sleep';
  description: string;
}

const ALL_ROUTINE_STEPS: RoutineItem[] = [
  { id: 'wake', name: 'Wake Up', period: 'Morning', order: 0, iconName: 'sun', description: 'Begin your day with morning light' },
  { id: 'brush', name: 'Morning Tea & Breakfast', period: 'Morning', order: 1, iconName: 'coffee', description: 'Have a warm tea and healthy breakfast' },
  { id: 'medicine', name: 'Take Morning Medicine', period: 'Morning', order: 2, iconName: 'pill', description: 'Take prescribed morning medication with water' },
  { id: 'walk', name: 'Morning Walk in Garden', period: 'Morning', order: 3, iconName: 'walk', description: 'Gentle walk for fresh air and gentle movement' },
  { id: 'lunch', name: 'Lunch & Family Time', period: 'Afternoon', order: 4, iconName: 'lunch', description: 'Nutritious lunch and relaxation' },
  { id: 'sleep', name: 'Night Sleep & Rest', period: 'Night', order: 5, iconName: 'sleep', description: 'Peaceful night rest to recharge' },
];

export default function DailyRoutineGame({ onBack }: DailyRoutineGameProps) {
  const { state } = useApp();
  const patientId = state.currentPatient?.id || 'default';
  const { speak } = useVoice();

  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [difficulty, setDifficulty] = useState(1);
  const [activeItems, setActiveItems] = useState<RoutineItem[]>([]);
  const [shuffledDeck, setShuffledDeck] = useState<RoutineItem[]>([]);
  const [placedSlots, setPlacedSlots] = useState<(RoutineItem | null)[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const getStepCount = (level: number) => {
    switch (level) {
      case 1: return 3; // Wake, Breakfast, Medicine
      case 2: return 4; // Wake, Breakfast, Medicine, Walk
      case 3: return 5; // Wake, Breakfast, Medicine, Walk, Lunch
      case 4:
      case 5: return 6; // All 6 steps
      default: return 3;
    }
  };

  const startLevel = (lvl: number) => {
    const count = getStepCount(lvl);
    const selected = ALL_ROUTINE_STEPS.slice(0, count).map((item, idx) => ({
      ...item,
      order: idx,
    }));

    setActiveItems(selected);
    const shuffled = [...selected].sort(() => Math.random() - 0.5);
    setShuffledDeck(shuffled);
    setPlacedSlots(new Array(count).fill(null));
    setSelectedCardId(null);
    setDifficulty(lvl);
    setAttempts(0);
    setStartTime(Date.now());
    setPhase('play');

    speak('Arrange your daily routine in chronological order. Tap a card, then tap where it happens first.');
  };

  const handleCardSelect = (item: RoutineItem) => {
    if (placedSlots.some(p => p?.id === item.id)) return;
    setSelectedCardId(item.id);
    speak(item.name);
  };

  const handleSlotClick = async (slotIdx: number) => {
    if (!selectedCardId) return;
    if (placedSlots[slotIdx] !== null) return;

    const card = activeItems.find(c => c.id === selectedCardId);
    if (!card) return;

    setAttempts(prev => prev + 1);

    // Errorless learning: if correct slot, lock into place
    if (card.order === slotIdx) {
      const nextSlots = [...placedSlots];
      nextSlots[slotIdx] = card;
      setPlacedSlots(nextSlots);
      setSelectedCardId(null);
      speak(`Correct! ${card.name}`);

      // Check if complete
      const isComplete = nextSlots.every(slot => slot !== null);
      if (isComplete) {
        const elapsed = (Date.now() - startTime) / 1000;
        setTotalTime(elapsed);
        const accuracy = Math.round((activeItems.length / Math.max(activeItems.length, attempts + 1)) * 100);

        const session: GameSession = {
          id: `routine_${Date.now()}`,
          patientId,
          gameType: 'recognise',
          difficulty,
          score: activeItems.length,
          totalObjects: activeItems.length,
          accuracy,
          responseTime: elapsed,
          timestamp: Date.now(),
        };
        await GameStorage.saveSession(session);
        setPhase('result');
        speak('Outstanding work! Your daily routine is fully completed.');
      }
    } else {
      // Gentle feedback without punishment
      setSelectedCardId(null);
      speak(`Not quite. Think about what time ${card.name} usually takes place.`);
    }
  };

  const renderIcon = (iconName: RoutineItem['iconName'], size = 28) => {
    switch (iconName) {
      case 'sun': return <Sun size={size} className="text-[#E65100]" />;
      case 'coffee': return <Coffee size={size} className="text-[#6D4C41]" />;
      case 'pill': return <Pill size={size} className="text-[#0288D1]" />;
      case 'walk': return <Footprints size={size} className="text-[#2E7D32]" />;
      case 'lunch': return <Utensils size={size} className="text-[#C2185B]" />;
      case 'sleep': return <Moon size={size} className="text-[#512DA8]" />;
      default: return <Sun size={size} className="text-[#E65100]" />;
    }
  };

  // INTRO PHASE
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex flex-col justify-between">
        <header className="bg-white border-b border-[#E0D8CC] px-5 py-4 shadow-sm">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="p-3 bg-[#FDF8F0] hover:bg-[#E0D8CC] rounded-2xl transition-colors border border-[#E0D8CC]"
                aria-label="Back"
              >
                <ArrowLeft size={22} className="text-[#1A1A1A]" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A]">Daily Routine</h1>
                <p className="text-sm md:text-base text-[#7A7A7A]">Temporal Orientation & Sequence Activity</p>
              </div>
            </div>
            <span className="text-xs md:text-sm font-bold text-[#1B5E20] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#1B5E20]/20">
              Cognitive Engagement
            </span>
          </div>
        </header>

        <main className="flex-1 max-w-3xl mx-auto px-5 py-8 space-y-6 w-full flex flex-col justify-center">
          <div className="bg-white rounded-3xl border-2 border-[#E0D8CC] p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-[#E8F5E9] flex items-center justify-center border-4 border-[#1B5E20]/20 shadow-md">
                <Sun size={48} className="text-[#1B5E20]" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Order Your Day</h2>
              <p className="text-base md:text-lg text-[#555555] max-w-xl mx-auto leading-relaxed">
                Connect each daily habit in the order you do it from morning until night. Strengthens focus, daily structure, and natural memory flow.
              </p>
            </div>

            {/* Steps Preview */}
            <div className="bg-[#FDF8F0] rounded-2xl p-5 border border-[#E0D8CC] space-y-3">
              <p className="text-xs font-bold text-[#7A7A7A] uppercase tracking-wider text-center">
                Example Sequence:
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap text-sm font-bold text-[#1A1A1A]">
                <span className="px-3 py-1.5 bg-white rounded-xl border border-[#E0D8CC] shadow-2xs flex items-center gap-1.5">
                  <Sun size={16} className="text-[#E65100]" /> Morning Wake
                </span>
                <span className="text-[#7A7A7A]">→</span>
                <span className="px-3 py-1.5 bg-white rounded-xl border border-[#E0D8CC] shadow-2xs flex items-center gap-1.5">
                  <Coffee size={16} className="text-[#6D4C41]" /> Breakfast
                </span>
                <span className="text-[#7A7A7A]">→</span>
                <span className="px-3 py-1.5 bg-white rounded-xl border border-[#E0D8CC] shadow-2xs flex items-center gap-1.5">
                  <Pill size={16} className="text-[#0288D1]" /> Medicine
                </span>
              </div>
            </div>

            {/* Level Picker */}
            <div className="space-y-3 pt-2">
              <span className="block text-sm font-bold text-[#1A1A1A] text-center">Select Starting Tier:</span>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => startLevel(1)}
                  className="py-3.5 px-4 bg-[#1B5E20] hover:bg-[#144718] text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-center"
                >
                  <span className="block text-lg">Level 1</span>
                  <span className="text-xs opacity-90">3 Steps (Gentle)</span>
                </button>
                <button
                  type="button"
                  onClick={() => startLevel(2)}
                  className="py-3.5 px-4 bg-[#E65100] hover:bg-[#D84315] text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-center"
                >
                  <span className="block text-lg">Level 2</span>
                  <span className="text-xs opacity-90">4 Steps</span>
                </button>
                <button
                  type="button"
                  onClick={() => startLevel(3)}
                  className="py-3.5 px-4 bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-center"
                >
                  <span className="block text-lg">Level 3</span>
                  <span className="text-xs opacity-90">5 Steps</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // PLAY PHASE
  if (phase === 'play') {
    const unplacedCards = shuffledDeck.filter(
      card => !placedSlots.some(p => p?.id === card.id)
    );

    return (
      <div className="min-h-screen bg-[#F5F0E8] flex flex-col justify-between">
        <header className="bg-white border-b border-[#E0D8CC] px-5 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPhase('intro')}
                className="p-2.5 bg-[#FDF8F0] hover:bg-[#E0D8CC] rounded-2xl transition-colors border border-[#E0D8CC]"
                aria-label="Back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A]">Arrange in Chronological Order</h2>
                <p className="text-xs md:text-sm text-[#7A7A7A]">Tap an item from below, then tap its slot</p>
              </div>
            </div>
            <span className="text-sm font-bold text-[#1B5E20] bg-[#E8F5E9] px-3.5 py-1 rounded-full border border-[#1B5E20]/20">
              Level {difficulty} ({activeItems.length} steps)
            </span>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-5 py-6 w-full flex flex-col justify-between space-y-6">
          {/* Target Timeline Slots */}
          <div className="bg-white rounded-3xl border-2 border-[#E0D8CC] p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#7A7A7A] uppercase tracking-wider">
                Timeline Sequence (Earlier → Later)
              </span>
              <button
                type="button"
                onClick={() => speak('Place morning steps on the left, and evening steps on the right.')}
                className="p-2 text-[#1B5E20] bg-[#E8F5E9] hover:bg-[#C8E6C9] rounded-xl transition-colors"
                title="Voice hint"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {placedSlots.map((slot, idx) => {
                const isOccupied = slot !== null;
                const canPlaceHere = selectedCardId !== null && !isOccupied;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSlotClick(idx)}
                    className={`relative rounded-2xl border-3 p-4 flex flex-col items-center justify-center text-center min-h-[130px] transition-all ${
                      isOccupied
                        ? 'bg-[#E8F5E9] border-[#1B5E20] shadow-sm'
                        : canPlaceHere
                        ? 'bg-[#FFF3E0] border-[#E65100] border-dashed hover:scale-102 ring-4 ring-[#E65100]/20 cursor-pointer animate-pulse'
                        : 'bg-[#FDF8F0] border-[#E0D8CC] border-dashed'
                    }`}
                  >
                    <span className="absolute top-2 left-2.5 text-xs font-extrabold text-[#7A7A7A]">
                      #{idx + 1}
                    </span>

                    {isOccupied ? (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-white shadow-2xs flex items-center justify-center mb-2">
                          {renderIcon(slot.iconName, 26)}
                        </div>
                        <span className="text-xs font-bold text-[#1A1A1A] leading-tight">
                          {slot.name}
                        </span>
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1B5E20] flex items-center justify-center">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-[#7A7A7A] mt-2">
                          {canPlaceHere ? 'Place Here' : `Step ${idx + 1}`}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Tray (Items to Place) */}
          <div className="space-y-3">
            <span className="block text-sm font-bold text-[#1A1A1A] px-1">
              Select an activity:
            </span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {unplacedCards.map(card => {
                const isSelected = selectedCardId === card.id;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleCardSelect(card)}
                    className={`p-4 rounded-2xl border-3 flex items-center gap-3.5 transition-all active:scale-95 shadow-xs ${
                      isSelected
                        ? 'bg-[#FFF3E0] border-[#E65100] shadow-md ring-4 ring-[#E65100]/20 scale-102'
                        : 'bg-white border-[#E0D8CC] hover:border-[#B0A695]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FDF8F0] border border-[#E0D8CC] flex items-center justify-center flex-shrink-0 shadow-2xs">
                      {renderIcon(card.iconName, 26)}
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-bold text-[#1A1A1A] leading-snug">
                        {card.name}
                      </span>
                      <span className="text-[11px] font-semibold text-[#7A7A7A]">
                        {card.period}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // RESULT PHASE
  const accuracy = Math.round((activeItems.length / Math.max(activeItems.length, attempts)) * 100);
  const canAdvance = accuracy >= 80 && difficulty < 5;

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col justify-between">
      <header className="bg-white border-b border-[#E0D8CC] px-5 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">Daily Routine Complete</h2>
            <p className="text-sm text-[#7A7A7A]">Chronological Orientation Results</p>
          </div>
          <span className="text-sm font-bold text-[#1B5E20] bg-[#E8F5E9] px-3.5 py-1 rounded-full border border-[#1B5E20]/20">
            Level {difficulty} of 5
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-5 py-8 space-y-6 w-full flex flex-col justify-center">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center shadow-lg border-4 border-[#1B5E20]/20 animate-in zoom-in-75 duration-200">
            <CheckCircle size={52} className="text-[#1B5E20]" />
          </div>
        </div>

        <div className="text-center max-w-lg mx-auto space-y-2">
          <p className="text-2xl md:text-3xl text-[#1A1A1A] font-extrabold leading-tight">
            {accuracy >= 80 ? 'Wonderful Routine Mastery!' : 'Good Effort on Today’s Routine!'}
          </p>
          <p className="text-base text-[#555555]">
            You arranged {activeItems.length} daily habits in chronological order.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <ProgressCard
            icon={<CheckCircle size={22} />}
            label="Steps"
            value={`${activeItems.length}`}
            color="#1B5E20"
          />
          <ProgressCard
            icon={<Sun size={22} />}
            label="Accuracy"
            value={`${accuracy}%`}
            color="#E65100"
          />
          <ProgressCard
            icon={<RotateCcw size={22} />}
            label="Time"
            value={`${Math.round(totalTime)}s`}
            color="#1565C0"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {canAdvance ? (
            <button
              type="button"
              onClick={() => startLevel(difficulty + 1)}
              className="w-full py-4 px-6 bg-[#1B5E20] hover:bg-[#144718] text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
            >
              <span>Advance to Level {difficulty + 1}</span>
              <ArrowRight size={24} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => startLevel(difficulty)}
              className="w-full py-4 px-6 bg-[#1B5E20] hover:bg-[#144718] text-white text-xl font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw size={22} />
              <span>Practice Level {difficulty} Again</span>
            </button>
          )}

          <LargeButton onPress={onBack} variant="outline">
            Back to Games Hub
          </LargeButton>
        </div>
      </main>
    </div>
  );
}
