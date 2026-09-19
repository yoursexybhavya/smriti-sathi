import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GameSession } from '../../models/GameSession';
import { REMEMBER_OBJECTS, RememberObject } from '../../models/GameSession';
import { GameStorage } from '../../services/storage/GameStorage';
import AppHeader from '../../components/AppHeader';
import LargeButton from '../../components/LargeButton';
import ProgressCard from '../../components/ProgressCard';
import { ArrowLeft, Clock, Target, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

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
  const isOnline = state.isOnline;

  const [phase, setPhase] = useState<Phase>('intro');
  const [difficulty, setDifficulty] = useState(1);
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

      if (card1?.objectId === card2?.objectId) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === card1.id || c.id === card2.id) ? { ...c, isMatched: true } : c
          ));
          setFlippedIds([]);
          setIsLocked(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === card1?.id || c.id === card2?.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedIds([]);
          setIsLocked(false);
        }, 1200);
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
      <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
        <AppHeader title="Memory Match" subtitle="Find the matching pairs" isOnline={isOnline} />
        <div className="flex-1 max-w-lg mx-auto px-5 py-6 space-y-6 w-full">
          <div className="p-6 bg-white rounded-2xl border border-[#E0D8CC] shadow-sm">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">How to play</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-[#4A4A4A]">
                <span className="font-bold text-[#1B5E20]">1.</span>
                <span>Tap a card to flip it over.</span>
              </li>
              <li className="flex gap-3 text-[#4A4A4A]">
                <span className="font-bold text-[#1B5E20]">2.</span>
                <span>Try to find the matching image by tapping another card.</span>
              </li>
              <li className="flex gap-3 text-[#4A4A4A]">
                <span className="font-bold text-[#1B5E20]">3.</span>
                <span>Match all the pairs to complete the level.</span>
              </li>
            </ul>
          </div>
          
          <div className="pt-4 space-y-3">
            <LargeButton onPress={() => startGame(1)} className="bg-[#2E7D32]">Start Level 1</LargeButton>
            <LargeButton onPress={() => startGame(2)}>Start Level 2</LargeButton>
            <LargeButton onPress={() => startGame(3)}>Start Level 3</LargeButton>
            <LargeButton onPress={onBack} variant="outline">Back to Games</LargeButton>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'play') {
    const gridCols = cards.length <= 4 ? 'grid-cols-2' : cards.length <= 6 ? 'grid-cols-3' : 'grid-cols-4';
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
        <div className="bg-white border-b border-[#E0D8CC] px-5 py-3 flex items-center justify-between">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20} /></button>
          <span className="text-sm font-medium text-[#1B5E20]">Moves: {moves}</span>
        </div>
        <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full p-6">
          <div className={`grid ${gridCols} gap-4`}>
            {cards.map(card => (
              <div 
                key={card.id} 
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-2xl cursor-pointer transition-all duration-300 transform-gpu relative shadow-sm border-2 ${
                  card.isFlipped || card.isMatched ? 'border-[#2E7D32] bg-white scale-100' : 'border-[#D4C5B0] bg-[#E8E2D9] hover:scale-105'
                }`}
              >
                {(card.isFlipped || card.isMatched) ? (
                  <div className="absolute inset-0 flex items-center justify-center p-3 animate-in fade-in zoom-in duration-300">
                    <img src={card.object.imageUrl} alt={card.object.name} className="w-full h-full object-contain rounded-lg" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target size={32} className="text-[#BCAEA0]" />
                  </div>
                )}
                {card.isMatched && (
                  <div className="absolute inset-0 bg-[#E8F5E9]/50 rounded-xl pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Result phase
  const pairCount = getPairCount(difficulty);
  const minMoves = pairCount;
  const accuracy = Math.round((minMoves / Math.max(minMoves, moves)) * 100);
  
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="bg-white border-b border-[#E0D8CC] px-5 py-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Activity Complete</h2>
          <p className="text-sm text-[#7A7A7A]">Your results</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6 pb-10">
        <div className="flex justify-center py-4">
          <div className="w-24 h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center shadow-md">
            <CheckCircle size={48} className="text-[#2E7D32]" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl text-[#1A1A1A] font-medium leading-relaxed">
            {accuracy >= 80 ? 'Excellent memory!' : 'Good effort!'} You matched all pairs in {moves} moves.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ProgressCard icon={<Target size={20} />} label="Moves" value={`${moves}`} color="#E65100" />
          <ProgressCard icon={<TrendingUp size={20} />} label="Accuracy" value={`${accuracy}%`} color="#1B5E20" />
          <ProgressCard icon={<Clock size={20} />} label="Time" value={`${Math.round(timeSpent)}s`} color="#1565C0" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4 flex justify-between items-center">
          <span className="text-base text-[#4A4A4A]">Difficulty Level</span>
          <span className="text-lg font-bold text-[#E65100]">Level {difficulty}</span>
        </div>

        <div className="space-y-3 pt-2">
          {accuracy >= 70 && difficulty < 5 ? (
            <LargeButton onPress={() => startGame(difficulty + 1)} className="bg-[#2E7D32]">
              Next Level
            </LargeButton>
          ) : (
            <LargeButton onPress={() => startGame(difficulty)}>
              Play Again
            </LargeButton>
          )}
          <LargeButton onPress={onBack} variant="outline">
            Back to Games
          </LargeButton>
        </div>
      </div>
    </div>
  );
}
