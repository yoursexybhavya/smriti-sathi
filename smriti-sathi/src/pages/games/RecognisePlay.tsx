import { useState } from 'react';
import { Check, Volume2, ArrowLeft } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import { RecogniseActivity } from '../../models/RecogniseGame';
import { useVoice } from '../../hooks/useVoice';
import { REMEMBER_OBJECTS, RememberObject } from '../../models/GameSession';
import ObjectCardVisual from '../../components/ObjectCardVisual';

interface RecognisePlayProps {
  activity: RecogniseActivity;
  onSubmit: (selected: string, timeSpent: number) => void;
  onBack?: () => void;
  questionNumber?: number;
  totalQuestions?: number;
  difficulty?: number;
}

export default function RecognisePlay({
  activity,
  onSubmit,
  onBack,
  questionNumber,
  totalQuestions,
  difficulty,
}: RecognisePlayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const { speak } = useVoice();

  const handleSubmit = () => {
    if (selectedOption) {
      const timeSpent = (Date.now() - startTime) / 1000;
      onSubmit(selectedOption, timeSpent);
    }
  };

  const handleSelect = (imageUrl: string, name?: string) => {
    setSelectedOption(imageUrl);
    if (name) {
      speak(name);
    }
  };

  // Helper to find RememberObject by imageUrl or ID
  const getObjectDetails = (imageUrl: string): RememberObject | undefined => {
    return (
      activity.objects.find(o => o.imageUrl === imageUrl) ||
      REMEMBER_OBJECTS.find(o => o.imageUrl === imageUrl)
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col justify-between transition-colors duration-200">
      {/* Unified Elder Header */}
      <header className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 sm:px-6 py-3.5 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl flex items-center justify-center bg-[var(--color-bg-subtle)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)] transition-colors cursor-pointer active:scale-95"
                aria-label="Back to Game Menu"
                title="Back to Game Menu"
              >
                <ArrowLeft size={22} />
              </button>
            )}
            {questionNumber && totalQuestions && (
              <span className="text-xs sm:text-sm font-bold text-[var(--color-text-secondary)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 rounded-full border border-[var(--color-border)]">
                Question {questionNumber} of {totalQuestions}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            {difficulty && (
              <span className="text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                Level {difficulty} of 5
              </span>
            )}
            <button
              type="button"
              onClick={() => speak(activity.question)}
              className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex-shrink-0 transition-colors cursor-pointer active:scale-95"
              title="Read question aloud"
              aria-label="Read question aloud"
            >
              <Volume2 size={22} />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text)] leading-snug">
            {activity.question}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
            {activity.type === 'odd-one-out'
              ? 'Tap the picture that is different, then tap Confirm below.'
              : 'Select the picture that completes the sequence.'}
          </p>
        </div>
      </header>

      {/* Main Game Play Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col items-center justify-center">
        {/* CASE 1: ODD-ONE-OUT (Direct 2x2 Interactive Grid) */}
        {activity.type === 'odd-one-out' && (
          <div className="w-full space-y-6">
            <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto">
              {activity.objects.map((obj, i) => {
                const isSelected = selectedOption === obj.imageUrl;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(obj.imageUrl, obj.name)}
                    className={`relative w-full rounded-3xl border-2 p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all active:scale-95 shadow-sm min-h-[160px] sm:min-h-[190px] cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-lg scale-102 ring-4 ring-indigo-500/20'
                        : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    {/* Object Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center overflow-hidden mb-2 bg-[var(--color-bg-subtle)] rounded-2xl p-2 border border-[var(--color-border)]/50">
                      <ObjectCardVisual
                        imageUrl={obj.imageUrl}
                        name={obj.name}
                        emoji={obj.emoji}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-contain drop-shadow-sm rounded-xl"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>

                    {/* Object Name Label */}
                    <span className={`text-base sm:text-lg font-bold ${
                      isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--color-text)]'
                    }`}>
                      {obj.name}
                    </span>

                    {/* Selection Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md animate-in fade-in zoom-in duration-150">
                        <Check size={20} className="text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Confirm Button for Odd-One-Out */}
            <div className="max-w-md mx-auto pt-2">
              <LargeButton
                onPress={handleSubmit}
                disabled={!selectedOption}
                variant={selectedOption ? 'primary' : 'secondary'}
              >
                {selectedOption ? 'Confirm Answer' : 'Tap an image to select'}
              </LargeButton>
            </div>
          </div>
        )}

        {/* CASE 2: PATTERN COMPLETION */}
        {activity.type === 'pattern' && (
          <div className="w-full space-y-6">
            {/* Pattern Display Row */}
            <div className="bg-[var(--color-card)] rounded-3xl p-5 sm:p-6 border-2 border-[var(--color-border)] shadow-sm max-w-2xl mx-auto">
              <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 text-center">
                Observe the repeating pattern:
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {[...activity.objects, ...activity.objects].map((obj, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--color-bg-subtle)] rounded-2xl border-2 border-[var(--color-border)] flex flex-col items-center justify-center p-2 shadow-xs">
                      <ObjectCardVisual imageUrl={obj.imageUrl} name={obj.name} emoji={obj.emoji} className="w-10 h-10 sm:w-12 sm:h-12" />
                      <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-text-secondary)] mt-0.5 truncate">{obj.name}</span>
                    </div>
                    {i < activity.objects.length * 2 - 1 && (
                      <span className="text-lg sm:text-xl font-bold text-[var(--color-text-muted)]">→</span>
                    )}
                  </div>
                ))}
                <span className="text-lg sm:text-xl font-bold text-[var(--color-text-muted)]">→</span>

                {/* Target Gap Slot with Live Selection Preview */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center p-2 shadow-sm transition-all ${
                  selectedOption
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 border-dashed ring-2 ring-indigo-500/20'
                    : 'border-indigo-400 dark:border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 border-dashed'
                }`}>
                  {selectedOption ? (
                    <>
                      <ObjectCardVisual
                        imageUrl={selectedOption}
                        name={getObjectDetails(selectedOption)?.name}
                        emoji={getObjectDetails(selectedOption)?.emoji}
                        className="w-10 h-10 sm:w-12 sm:h-12"
                      />
                      <span className="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
                        {getObjectDetails(selectedOption)?.name || 'Choice'}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">?</span>
                  )}
                </div>
              </div>
            </div>

            {/* Choices Grid */}
            <div className="max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto space-y-4">
              <p className="text-base font-bold text-[var(--color-text)] text-center">
                What comes next? Select your answer:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activity.options.map((option, i) => {
                  const details = getObjectDetails(option);
                  const isSelected = selectedOption === option;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(option, details?.name)}
                      className={`relative bg-[var(--color-card)] rounded-2xl border-2 p-3 flex flex-col items-center justify-center transition-all active:scale-95 min-h-[110px] ${
                        isSelected
                          ? 'border-[#10B981] bg-[#10B981]/15 shadow-md ring-2 ring-[#10B981]/30'
                          : 'border-[var(--color-border)] hover:border-[#10B981]'
                      }`}
                    >
                      <div className="w-14 h-14 flex items-center justify-center overflow-hidden mb-1 bg-[var(--color-bg-subtle)] rounded-xl p-1.5 border border-[var(--color-border)]/50">
                        <ObjectCardVisual imageUrl={option} name={details?.name} emoji={details?.emoji} className="w-full h-full" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[var(--color-text)] truncate">
                        {details?.name || `Option ${i + 1}`}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center shadow-xs">
                          <Check size={14} className="text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <LargeButton
                  onPress={handleSubmit}
                  disabled={!selectedOption}
                  className={selectedOption ? 'bg-[#10B981] text-white hover:bg-[#059669]' : ''}
                >
                  {selectedOption ? 'Confirm Answer ✓' : 'Select an answer above'}
                </LargeButton>
              </div>
            </div>
          </div>
        )}

        {/* CASE 3: SEQUENCE COMPLETION */}
        {activity.type === 'sequence' && (
          <div className="w-full space-y-6">
            {/* Sequence Row */}
            <div className="bg-[var(--color-card)] rounded-3xl p-5 sm:p-6 border-2 border-[var(--color-border)] shadow-sm max-w-2xl mx-auto">
              <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 text-center">
                Find the missing item in the sequence:
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {activity.objects.map((obj, i) => {
                  const isGap = i === Math.floor(activity.objects.length / 2);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      {isGap ? (
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center p-2 shadow-sm transition-all ${
                          selectedOption
                            ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 border-dashed ring-2 ring-indigo-500/20'
                            : 'border-indigo-400 dark:border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 border-dashed'
                        }`}>
                          {selectedOption ? (
                            <>
                              <ObjectCardVisual
                                imageUrl={selectedOption}
                                name={getObjectDetails(selectedOption)?.name}
                                emoji={getObjectDetails(selectedOption)?.emoji}
                                className="w-10 h-10 sm:w-12 sm:h-12"
                              />
                              <span className="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
                                {getObjectDetails(selectedOption)?.name || 'Choice'}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">?</span>
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--color-bg-subtle)] rounded-2xl border-2 border-[var(--color-border)] flex flex-col items-center justify-center p-2 shadow-xs">
                          <ObjectCardVisual imageUrl={obj.imageUrl} name={obj.name} emoji={obj.emoji} className="w-10 h-10 sm:w-12 sm:h-12" />
                          <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-text-secondary)] mt-0.5 truncate">{obj.name}</span>
                        </div>
                      )}
                      {i < activity.objects.length - 1 && (
                        <span className="text-lg sm:text-xl font-bold text-[var(--color-text-muted)]">→</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sequence Choices */}
            <div className="max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto space-y-4">
              <p className="text-base font-bold text-[var(--color-text)] text-center">
                Select the missing item:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activity.options.map((option, i) => {
                  const details = getObjectDetails(option);
                  const isSelected = selectedOption === option;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(option, details?.name)}
                      className={`relative bg-[var(--color-card)] rounded-2xl border-2 p-3 flex flex-col items-center justify-center transition-all active:scale-95 min-h-[110px] ${
                        isSelected
                          ? 'border-[#10B981] bg-[#10B981]/15 shadow-md ring-2 ring-[#10B981]/30'
                          : 'border-[var(--color-border)] hover:border-[#10B981]'
                      }`}
                    >
                      <div className="w-14 h-14 flex items-center justify-center overflow-hidden mb-1 bg-[var(--color-bg-subtle)] rounded-xl p-1.5 border border-[var(--color-border)]/50">
                        <ObjectCardVisual imageUrl={option} name={details?.name} emoji={details?.emoji} className="w-full h-full" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[var(--color-text)] truncate">
                        {details?.name || `Option ${i + 1}`}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center shadow-xs">
                          <Check size={14} className="text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <LargeButton
                  onPress={handleSubmit}
                  disabled={!selectedOption}
                  variant={selectedOption ? 'success' : 'secondary'}
                >
                  {selectedOption ? 'Confirm Answer' : 'Select an item above'}
                </LargeButton>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
