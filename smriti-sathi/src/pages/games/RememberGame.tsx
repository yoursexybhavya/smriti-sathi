import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RememberObject, GameSession } from '../../models/GameSession';
import { DifficultyEngine } from '../../services/adaptive_engine/DifficultyEngine';
import { GameStorage } from '../../services/storage/GameStorage';
import RememberIntro from './RememberIntro';
import RememberMemorize from './RememberMemorize';
import RememberRecall from './RememberRecall';
import RememberResult from './RememberResult';

interface RememberGameProps {
  onBack: () => void;
}

type GamePhase = 'intro' | 'memorize' | 'recall' | 'result';

export default function RememberGame({ onBack }: RememberGameProps) {
  const { state } = useApp();
  const patientId = state.currentPatient?.id || 'default';

  const [phase, setPhase] = useState<GamePhase>('intro');
  const [difficulty, setDifficulty] = useState(1);
  const [targetObjects, setTargetObjects] = useState<RememberObject[]>([]);
  const [recallSet, setRecallSet] = useState<RememberObject[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<RememberObject[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [responseTime, setResponseTime] = useState(0);

  // Initialize game
  const startGame = () => {
    const config = DifficultyEngine.getConfig(difficulty);
    const objects = DifficultyEngine.selectObjects(config.objectCount);
    const recall = DifficultyEngine.createRecallSet(objects, config.distractorCount);
    
    setTargetObjects(objects);
    setRecallSet(recall);
    setPhase('memorize');
  };

  // Memorization complete
  const handleMemorizeComplete = () => {
    setStartTime(Date.now());
    setPhase('recall');
  };

  // Recall submitted
  const handleRecallSubmit = async (selected: RememberObject[]) => {
    const endTime = Date.now();
    const timeInSeconds = (endTime - startTime) / 1000;
    
    setSelectedObjects(selected);
    setResponseTime(timeInSeconds);
    setPhase('result');

    // Save session
    const { score, accuracy } = DifficultyEngine.calculateScore(selected, targetObjects);
    const session: GameSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      patientId,
      gameType: 'remember',
      difficulty,
      score,
      totalObjects: targetObjects.length,
      accuracy,
      responseTime: timeInSeconds,
      timestamp: Date.now(),
    };
    
    await GameStorage.saveSession(session);
  };

  // Play again
  const handlePlayAgain = () => {
    // Suggest next difficulty based on performance
    const { accuracy } = DifficultyEngine.calculateScore(selectedObjects, targetObjects);
    const nextLevel = DifficultyEngine.suggestNextLevel(difficulty, accuracy);
    setDifficulty(nextLevel);
    
    // Reset and start new game
    setPhase('intro');
    setSelectedObjects([]);
    setResponseTime(0);
  };

  // Back to games
  const handleBackToGames = () => {
    onBack();
  };

  // Render current phase
  switch (phase) {
    case 'intro':
      return <RememberIntro onStart={startGame} onBack={onBack} />;
    
    case 'memorize':
      const config = DifficultyEngine.getConfig(difficulty);
      return (
        <RememberMemorize
          objects={targetObjects}
          memorizeTime={config.memorizeTime}
          onComplete={handleMemorizeComplete}
        />
      );
    
    case 'recall':
      return (
        <RememberRecall
          recallSet={recallSet}
          targetObjects={targetObjects}
          onSubmit={handleRecallSubmit}
        />
      );
    
    case 'result':
      return (
        <RememberResult
          targetObjects={targetObjects}
          selectedObjects={selectedObjects}
          responseTime={responseTime}
          difficulty={difficulty}
          onPlayAgain={handlePlayAgain}
          onBackToGames={handleBackToGames}
        />
      );
    
    default:
      return <RememberIntro onStart={startGame} onBack={onBack} />;
  }
}
