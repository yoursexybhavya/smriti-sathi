import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GameSession } from '../../models/GameSession';
import { REMEMBER_OBJECTS, RememberObject } from '../../models/GameSession';
import { GameStorage } from '../../services/storage/GameStorage';
import AppHeader from '../../components/AppHeader';
import LargeButton from '../../components/LargeButton';
import ProgressCard from '../../components/ProgressCard';
import ObjectCardVisual from '../../components/ObjectCardVisual';
import { ArrowLeft, Clock, Target, TrendingUp, CheckCircle, Sparkles, HelpCircle } from 'lucide-react';

interface MemoryMatchGameProps {
  onBack: () => void;
}

type Phase = 'intro' | 'play' | 'result';

interface CardItem {
  id: string; // unique card id for the grid
  objectId: string; // the id of the object on the card
  object: RememberObject;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatchGame({ onBack }: MemoryMatchGameProps) {
  const { state } = useApp();
  const patientId = state.currentPatient?.id || 'default';
  const isOnline = navigator.onLine;

  const [phase, setPhase] = useState<Phase>('intro');
  const [difficulty, setDifficulty] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const getPairCount = (level: number) => {
    switch (level) {
      case 1: return 2; // 4 cards
      case 2: return 3; // 6 cards
      case 3: return 4; // 8 cards
      case 4: return 6; // 12 cards
      case 5: return 8; // 16 cards
      default: return 2;
    }
  };

  const startGame = (level: number) => {
    const pairCount = getPairCount(level);
    const shuffledObjects = [...REMEMBER_OBJECTS].sort(() => Math.random() - 0.5).slice(0, pairCount);
    
    // Create pairs
    const gameCards: CardItem[] = [];
    shuffledObjects.forEach(obj => {
      gameCards.push({ id: Math.random().toString(), objectId: obj.id, object: obj, isFlipped: false, isMatched: false });
      gameCards.push({ id: Math.random().toString(), objectId: obj.id, object: obj, isFlipped: false, isMatched: false });
    });

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setDifficulty(level);
    setFlippedIds([]);
    setMoves(0);
    setPhase('play');
    setStartTime(Date.now());
  };

  const handleCardClick = (id: string) => {
    if (isLocked) return;
    
    const cardIndex = cards.findIndex(c => c.id === id);
    if (cardIndex === -1 || cards[cardIndex].isFlipped || cards[cardIndex].isMatched) return;

    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);
      
      const card1 = cards.find(c => c.id === newFlipped[0]);
      const card2 = cards.find(c => c.id === newFlipped[1]);

      if (card1 && card2 && card1.objectId === card2.objectId) {
        // Match!
        const id1 = card1.id;
        const id2 = card2.id;
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === id1 || c.id === id2) ? { ...c, isMatched: true } : c
          ));
          setFlippedIds([]);
          setIsLocked(false);
        }, 500);
      } else {
        // No match
        const id1 = card1?.id;
        const id2 = card2?.id;
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === id1 || c.id === id2) ? { ...c, isFlipped: false } : c
          ));
          setFlippedIds([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  // Check win condition
  useEffect(() => {
    if (phase === 'play' && cards.length > 0 && cards.every(c => c.isMatched)) {
      const endTime = Date.now();
      const timeElapsed = (endTime - startTime) / 1000;
      setTimeSpent(timeElapsed);
      
      const pairCount = getPairCount(difficulty);
      const minMoves = pairCount;
      const accuracy = Math.round((minMoves / Math.max(minMoves, moves)) * 100);

      const session: GameSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        patientId,
        gameType: 'memory_match',
        difficulty,
        score: pairCount,
        totalObjects: pairCount,
        accuracy,
        responseTime: timeElapsed,
        timestamp: Date.now(),
      };
      
      GameStorage.saveSession(session).then(() => {
        setPhase('result');
      });
    }
  }, [cards, phase, difficulty, moves, patientId, startTime]);

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col transition-colors duration-200">
        <AppHeader 
          title="Memory Match" 
          subtitle="Find the matching pairs" 
          isOnline={isOnline} 
          showBack 
          onBack={onBack} 
        />
        <div className="flex-1 max-w-lg mx-auto px-4 sm:px-6 py-6 space-y-6 w-full flex flex-col justify-center">
          <div className="p-6 bg-[var(--color-card)] rounded-3xl border-2 border-[var(--color-border)] shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 mx-auto flex items-center justify-center text-[#10B981]">
              <Sparkles size={36} />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text)] text-center">How to Play</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-[var(--color-text-secondary)]">
                <span className="font-bold text-[#10B981] bg-[var(--color-bg-subtle)] w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <span className="pt-0.5">Tap any card to flip it over and see the image.</span>
              </li>
              <li className="flex gap-3 text-[var(--color-text-secondary)]">
                <span className="font-bold text-[#10B981] bg-[var(--color-bg-subtle)] w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <span className="pt-0.5">Tap a second card to find its matching twin.</span>
              </li>
              <li className="flex gap-3 text-[var(--color-text-secondary)]">
                <span className="font-bold text-[#10B981] bg-[var(--color-bg-subtle)] w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                <span className="pt-0.5">Match all the pairs to complete the level. No timer pressure!</span>
              </li>
            </ul>
          </div>
          
          {/* Clean Tier Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-text)] mb-2 text-center">
                Select Difficulty Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { level: 1, label: 'Gentle', sub: '2 Pairs' },
                  { level: 2, label: 'Standard', sub: '3 Pairs' },
                  { level: 3, label: 'Active', sub: '4 Pairs' },
                  { level: 4, label: 'Master', sub: '6 Pairs' },
                  { level: 5, label: 'Champion', sub: '8 Pairs' },
                ].map(tier => (
                  <button
                    key={tier.level}
                    type="button"
                    onClick={() => setSelectedLevel(tier.level)}
                    className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer select-none active:scale-95 ${
                      selectedLevel === tier.level
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs ring-2 ring-indigo-500/20'
                        : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-slate-300 dark:hover:border-slate-700 font-medium'
                    }`}
                  >
                    <span className="block text-sm font-bold">Level {tier.level}</span>
                    <span className="block text-xs text-[var(--color-text-muted)] mt-0.5">{tier.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <LargeButton
              variant="primary"
              onPress={() => startGame(selectedLevel)}
            >
              Start Level {selectedLevel}
            </LargeButton>

            <LargeButton onPress={onBack} variant="outline">
              Back to Games Hub
            </LargeButton>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'play') {
    const gridCols = cards.length <= 4 ? 'grid-cols-2' : cards.length <= 6 ? 'grid-cols-3' : 'grid-cols-4';
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col justify-between transition-colors duration-200">
        <header className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setPhase('intro')} 
              className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl flex items-center justify-center bg-[var(--color-bg-subtle)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)] transition-colors cursor-pointer active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)]">Memory Match</h2>
              <span className="text-xs text-[var(--color-text-secondary)]">Level {difficulty}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-bold text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-full border border-[#10B981]/30">
              Moves: {moves}
            </span>
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full p-4 sm:p-6">
          <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
            {cards.map(card => (
              <button 
                key={card.id} 
                type="button"
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-3xl cursor-pointer transition-all duration-300 transform-gpu relative shadow-sm border-3 ${
                  card.isFlipped || card.isMatched 
                    ? 'border-[#10B981] bg-[var(--color-card)] ring-4 ring-[#10B981]/20 scale-102' 
                    : 'border-[var(--color-border)] bg-[var(--color-bg-subtle)] hover:border-[#10B981] hover:scale-102'
                }`}
                aria-label={card.isFlipped || card.isMatched ? card.object.name : 'Hidden card'}
              >
                {(card.isFlipped || card.isMatched) ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2.5 animate-in fade-in zoom-in duration-200">
                    <ObjectCardVisual imageUrl={card.object.imageUrl} name={card.object.name} emoji={card.object.emoji} className="w-14 h-14 sm:w-20 sm:h-20" />
                    <span className="text-xs sm:text-sm font-bold text-[var(--color-text)] mt-1 truncate w-full text-center">
                      {card.object.name}
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)]">
                      <HelpCircle size={24} />
                    </div>
                  </div>
                )}
                {card.isMatched && (
                  <div className="absolute inset-0 bg-[#10B981]/15 rounded-3xl pointer-events-none border-2 border-[#10B981]" />
                )}
              </button>
            ))}
          </div>
        </main>

        <footer className="bg-[var(--color-card)] border-t border-[var(--color-border)] px-4 py-3 text-center">
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
            Tap cards to find pairs. Matched pairs stay turned up!
          </p>
        </footer>
      </div>
    );
  }

  // Result phase
  const pairCount = getPairCount(difficulty);
  const minMoves = pairCount;
  const accuracy = Math.round((minMoves / Math.max(minMoves, moves)) * 100);
  
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      <header className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 sm:px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Activity Complete</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Match Results & Progression</p>
          </div>
          <span className="text-sm font-bold text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-full border border-[#10B981]/30">
            Level {difficulty}
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-6 space-y-6 pb-10">
        <div className="flex justify-center py-2">
          <div className="w-24 h-24 rounded-full bg-[#10B981]/15 flex items-center justify-center shadow-md border-4 border-[#10B981]/30">
            <CheckCircle size={48} className="text-[#10B981]" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl text-[var(--color-text)] font-extrabold leading-tight">
            {accuracy >= 80 ? 'Excellent memory!' : 'Good effort!'}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            You matched all pairs in {moves} moves.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ProgressCard icon={<Target size={20} />} label="Moves" value={`${moves}`} color="#E65100" />
          <ProgressCard icon={<TrendingUp size={20} />} label="Accuracy" value={`${accuracy}%`} color="#10B981" />
          <ProgressCard icon={<Clock size={20} />} label="Time" value={`${Math.round(timeSpent)}s`} color="#0EA5E9" />
        </div>

        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4 flex justify-between items-center">
          <span className="text-base text-[var(--color-text)] font-semibold">Difficulty Level</span>
          <span className="text-base font-bold text-[#E65100] bg-[#E65100]/15 px-3 py-0.5 rounded-full border border-[#E65100]/30">
            Level {difficulty}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {accuracy >= 70 && difficulty < 5 ? (
            <LargeButton variant="primary" onPress={() => startGame(difficulty + 1)}>
              Advance to Level {difficulty + 1}
            </LargeButton>
          ) : (
            <LargeButton variant="primary" onPress={() => startGame(difficulty)}>
              Play Level {difficulty} Again
            </LargeButton>
          )}
          <LargeButton onPress={onBack} variant="outline">
            Back to Games Hub
          </LargeButton>
        </div>
      </main>
    </div>
  );
}
