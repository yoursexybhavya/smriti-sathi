import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GameSession } from '../../models/GameSession';
import { RecogniseGameEngine, RecogniseActivity } from '../../models/RecogniseGame';
import { GameStorage } from '../../services/storage/GameStorage';
import { AdaptiveDifficultyService } from '../../services/adaptive_engine/AdaptiveDifficultyService';
import RecogniseIntro from './RecogniseIntro';
import RecognisePlay from './RecognisePlay';
import RecogniseResult from './RecogniseResult';

interface RecogniseGameProps {
  onBack: () => void;
}

type GamePhase = 'intro' | 'play' | 'result';

export default function RecogniseGame({ onBack }: RecogniseGameProps) {
  const { state } = useApp();
  const patientId = state.currentPatient?.id || 'default';

  const [phase, setPhase] = useState<GamePhase>('intro');
  const [difficulty, setDifficulty] = useState(1);
  const [currentActivity, setCurrentActivity] = useState<RecogniseActivity | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions] = useState(5); // 5 questions per session
  const [correctCount, setCorrectCount] = useState(0);
  const [lastAnswer, setLastAnswer] = useState({ selected: '', correct: '', isCorrect: false });
  const [totalTime, setTotalTime] = useState(0);
  const [adjustmentMessage, setAdjustmentMessage] = useState('');

  // Initialize game with adaptive difficulty
  useEffect(() => {
    if (phase === 'intro') {
      // Get suggested difficulty from adaptive engine
      const loadDifficulty = async () => {
        const adjustment = await AdaptiveDifficultyService.calculateSuggestedDifficulty(
          patientId,
          'recognise',
          difficulty
        );
        
        setDifficulty(adjustment.suggestedDifficulty);
        setAdjustmentMessage(AdaptiveDifficultyService.getAdjustmentMessage(adjustment));
      };
      
      loadDifficulty();
    }
  }, [phase, patientId]);

  // Start game
  const startGame = () => {
    const activity = RecogniseGameEngine.generateActivity(difficulty);
    setCurrentActivity(activity);
    setQuestionNumber(1);
    setCorrectCount(0);
    setTotalTime(0);
    setPhase('play');
  };

  // Handle answer submission
  const handleAnswerSubmit = async (selectedAnswer: string, timeSpent: number) => {
    if (!currentActivity) return;

    const isCorrect = selectedAnswer === currentActivity.correctAnswer;
    
    setLastAnswer({
      selected: selectedAnswer,
      correct: currentActivity.correctAnswer,
      isCorrect,
    });

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    setTotalTime(prev => prev + timeSpent);

    // Check if this was the last question
    if (questionNumber >= totalQuestions) {
      // Save session
      const accuracy = Math.round(((correctCount + (isCorrect ? 1 : 0)) / totalQuestions) * 100);
      const session: GameSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        patientId,
        gameType: 'recognise',
        difficulty,
        score: correctCount + (isCorrect ? 1 : 0),
        totalObjects: totalQuestions,
        accuracy,
        responseTime: totalTime + timeSpent,
        timestamp: Date.now(),
      };
      
      await GameStorage.saveSession(session);
      setPhase('result');
    } else {
      // Next question
      const nextActivity = RecogniseGameEngine.generateActivity(difficulty);
      setCurrentActivity(nextActivity);
      setQuestionNumber(prev => prev + 1);
    }
  };

  // Play again at same level
  const handlePlayAgain = () => {
    setPhase('intro');
    setQuestionNumber(1);
    setCorrectCount(0);
    setTotalTime(0);
  };

  // Advance to next difficulty level directly
  const handleNextLevel = () => {
    const nextDiff = Math.min(5, difficulty + 1);
    setDifficulty(nextDiff);
    const activity = RecogniseGameEngine.generateActivity(nextDiff);
    setCurrentActivity(activity);
    setQuestionNumber(1);
    setCorrectCount(0);
    setTotalTime(0);
    setPhase('play');
  };

  // Jump to specific level
  const handleSelectLevel = (lvl: number) => {
    setDifficulty(lvl);
    const activity = RecogniseGameEngine.generateActivity(lvl);
    setCurrentActivity(activity);
    setQuestionNumber(1);
    setCorrectCount(0);
    setTotalTime(0);
    setPhase('play');
  };

  // Back to games
  const handleBackToGames = () => {
    onBack();
  };

  // Render current phase
  switch (phase) {
    case 'intro':
      return (
        <div>
          {adjustmentMessage && (
            <div className="bg-[#10B981]/15 border-b border-[#10B981]/30 px-5 py-3">
              <p className="text-sm text-[#10B981] font-semibold text-center">
                {adjustmentMessage}
              </p>
            </div>
          )}
          <RecogniseIntro onStart={startGame} onBack={onBack} />
        </div>
      );
    
    case 'play':
      return currentActivity ? (
        <RecognisePlay
          activity={currentActivity}
          onSubmit={handleAnswerSubmit}
          onBack={() => setPhase('intro')}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          difficulty={difficulty}
        />
      ) : null;
    
    case 'result':
      return (
        <RecogniseResult
          isCorrect={lastAnswer.isCorrect}
          correctAnswer={lastAnswer.correct}
          selectedAnswer={lastAnswer.selected}
          responseTime={totalTime}
          difficulty={difficulty}
          totalQuestions={totalQuestions}
          correctCount={correctCount}
          onPlayAgain={handlePlayAgain}
          onNextLevel={handleNextLevel}
          onSelectLevel={handleSelectLevel}
          onBackToGames={handleBackToGames}
        />
      );
    
    default:
      return <RecogniseIntro onStart={startGame} onBack={onBack} />;
  }
}
