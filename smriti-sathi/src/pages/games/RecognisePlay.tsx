import { useState } from 'react';
import { Check, Volume2 } from 'lucide-react';
import LargeButton from '../../components/LargeButton';
import { RecogniseActivity } from '../../models/RecogniseGame';
import { useVoice } from '../../hooks/useVoice';
import { REMEMBER_OBJECTS, RememberObject } from '../../models/GameSession';

interface RecognisePlayProps {
  activity: RecogniseActivity;
  onSubmit: (selected: string, timeSpent: number) => void;
}

export default function RecognisePlay({ activity, onSubmit }: RecognisePlayProps) {
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
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col justify-between">
      {/* Header with Instruction & Spoken Audio */}
      <header className="bg-white border-b border-[#E0D8CC] px-5 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A] leading-snug">
              {activity.question}
            </h2>
            <p className="text-sm md:text-base text-[#555555] mt-1 font-medium">
              {activity.type === 'odd-one-out'
                ? 'Tap the picture that is different, then tap Confirm below.'
                : 'Select the picture that completes the sequence.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => speak(activity.question)}
            className="w-11 h-11 rounded-full bg-[#E8F5E9] hover:bg-[#C8E6C9] flex items-center justify-center text-[#1B5E20] flex-shrink-0 transition-colors"
            title="Read question aloud"
            aria-label="Read question aloud"
          >
            <Volume2 size={22} />
          </button>
        </div>
      </header>

      {/* Main Game Play Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 py-6 flex flex-col items-center justify-center">
        {/* CASE 1: ODD-ONE-OUT (Direct 2x2 Interactive Grid — NO DUPLICATE BOTTOM LIST) */}
        {activity.type === 'odd-one-out' && (
          <div className="w-full space-y-6">
            <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
              {activity.objects.map((obj, i) => {
                const isSelected = selectedOption === obj.imageUrl;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(obj.imageUrl, obj.name)}
                    className={`relative w-full rounded-2xl border-4 p-4 md:p-6 flex flex-col items-center justify-center text-center transition-all active:scale-95 shadow-sm min-h-[160px] md:min-h-[190px] ${
                      isSelected
                        ? 'border-[#E65100] bg-[#FFF3E0] shadow-lg scale-102 ring-4 ring-[#E65100]/20'
                        : 'border-[#E0D8CC] bg-white hover:border-[#B0A695]'
                    }`}
                  >
                    {/* Object Image */}
                    <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center overflow-hidden mb-2">
                      <img
                        src={obj.imageUrl}
                        alt={obj.name}
                        className="w-full h-full object-contain drop-shadow-sm rounded-xl"
                        loading="eager"
                        onError={(e) => {
                          // Fallback icon placeholder if image fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Object Name Label */}
                    <span className={`text-base md:text-xl font-bold ${
                      isSelected ? 'text-[#E65100]' : 'text-[#1A1A1A]'
                    }`}>
                      {obj.name}
                    </span>

                    {/* Selection Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#E65100] flex items-center justify-center shadow-md animate-in fade-in zoom-in duration-150">
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
                className={selectedOption ? 'bg-[#E65100] text-white hover:bg-[#D84315]' : ''}
              >
                {selectedOption ? 'Confirm Answer ✓' : 'Tap an image to select'}
              </LargeButton>
            </div>
          </div>
        )}

        {/* CASE 2: PATTERN COMPLETION */}
        {activity.type === 'pattern' && (
          <div className="w-full space-y-8">
            {/* Pattern Display Row */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#E0D8CC] shadow-sm max-w-2xl mx-auto">
              <p className="text-xs font-bold text-[#7A7A7A] uppercase tracking-wider mb-4 text-center">
                Observe the repeating pattern:
              </p>
              <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                {[...activity.objects, ...activity.objects].map((obj, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FDF8F0] rounded-2xl border-2 border-[#E0D8CC] flex flex-col items-center justify-center p-2 shadow-xs">
                      <img src={obj.imageUrl} alt={obj.name} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                      <span className="text-[10px] md:text-xs font-semibold text-[#4A4A4A] mt-0.5 truncate">{obj.name}</span>
                    </div>
                    {i < activity.objects.length * 2 - 1 && (
                      <span className="text-lg md:text-xl font-bold text-[#7A7A7A]">→</span>
                    )}
                  </div>
                ))}
                <span className="text-lg md:text-xl font-bold text-[#7A7A7A]">→</span>

                {/* Target Gap Slot with Live Selection Preview */}
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-3 flex flex-col items-center justify-center p-2 shadow-sm transition-all ${
                  selectedOption
                    ? 'border-[#1B5E20] bg-[#E8F5E9] border-dashed ring-2 ring-[#1B5E20]/30'
                    : 'border-[#E65100] bg-[#FFF3E0] border-dashed'
                }`}>
                  {selectedOption ? (
                    <>
                      <img src={selectedOption} alt="Selected" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                      <span className="text-[10px] md:text-xs font-bold text-[#1B5E20] truncate">
                        {getObjectDetails(selectedOption)?.name || 'Choice'}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-[#E65100]">?</span>
                  )}
                </div>
              </div>
            </div>

            {/* Choices Grid */}
            <div className="max-w-xl mx-auto space-y-4">
              <p className="text-base font-bold text-[#1A1A1A] text-center">
                What comes next? Select your answer:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {activity.options.map((option, i) => {
                  const details = getObjectDetails(option);
                  const isSelected = selectedOption === option;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(option, details?.name)}
                      className={`relative bg-white rounded-2xl border-3 p-3 flex flex-col items-center justify-center transition-all active:scale-95 min-h-[110px] ${
                        isSelected
                          ? 'border-[#1B5E20] bg-[#E8F5E9] shadow-md'
                          : 'border-[#E0D8CC] hover:border-[#B0A695]'
                      }`}
                    >
                      <div className="w-14 h-14 flex items-center justify-center overflow-hidden mb-1">
                        <img src={option} alt={details?.name || 'Option'} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs md:text-sm font-bold text-[#1A1A1A] truncate">
                        {details?.name || `Option ${i + 1}`}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#1B5E20] flex items-center justify-center shadow-xs">
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
                  className={selectedOption ? 'bg-[#1B5E20] text-white hover:bg-[#144718]' : ''}
                >
                  {selectedOption ? 'Confirm Answer ✓' : 'Select an answer above'}
                </LargeButton>
              </div>
            </div>
          </div>
        )}

        {/* CASE 3: SEQUENCE COMPLETION */}
        {activity.type === 'sequence' && (
          <div className="w-full space-y-8">
            {/* Sequence Row */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#E0D8CC] shadow-sm max-w-2xl mx-auto">
              <p className="text-xs font-bold text-[#7A7A7A] uppercase tracking-wider mb-4 text-center">
                Find the missing item in the sequence:
              </p>
              <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                {activity.objects.map((obj, i) => {
                  const isGap = i === Math.floor(activity.objects.length / 2);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      {isGap ? (
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-3 flex flex-col items-center justify-center p-2 shadow-sm transition-all ${
                          selectedOption
                            ? 'border-[#1B5E20] bg-[#E8F5E9] border-dashed ring-2 ring-[#1B5E20]/30'
                            : 'border-[#E65100] bg-[#FFF3E0] border-dashed'
                        }`}>
                          {selectedOption ? (
                            <>
                              <img src={selectedOption} alt="Selected" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                              <span className="text-[10px] md:text-xs font-bold text-[#1B5E20] truncate">
                                {getObjectDetails(selectedOption)?.name || 'Choice'}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-[#E65100]">?</span>
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FDF8F0] rounded-2xl border-2 border-[#E0D8CC] flex flex-col items-center justify-center p-2 shadow-xs">
                          <img src={obj.imageUrl} alt={obj.name} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                          <span className="text-[10px] md:text-xs font-semibold text-[#4A4A4A] mt-0.5 truncate">{obj.name}</span>
                        </div>
                      )}
                      {i < activity.objects.length - 1 && (
                        <span className="text-lg md:text-xl font-bold text-[#7A7A7A]">→</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sequence Choices */}
            <div className="max-w-xl mx-auto space-y-4">
              <p className="text-base font-bold text-[#1A1A1A] text-center">
                Select the missing item:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {activity.options.map((option, i) => {
                  const details = getObjectDetails(option);
                  const isSelected = selectedOption === option;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(option, details?.name)}
                      className={`relative bg-white rounded-2xl border-3 p-3 flex flex-col items-center justify-center transition-all active:scale-95 min-h-[110px] ${
                        isSelected
                          ? 'border-[#1B5E20] bg-[#E8F5E9] shadow-md'
                          : 'border-[#E0D8CC] hover:border-[#B0A695]'
                      }`}
                    >
                      <div className="w-14 h-14 flex items-center justify-center overflow-hidden mb-1">
                        <img src={option} alt={details?.name || 'Option'} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs md:text-sm font-bold text-[#1A1A1A] truncate">
                        {details?.name || `Option ${i + 1}`}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#1B5E20] flex items-center justify-center shadow-xs">
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
                  className={selectedOption ? 'bg-[#1B5E20] text-white hover:bg-[#144718]' : ''}
                >
                  {selectedOption ? 'Confirm Answer ✓' : 'Select missing item above'}
                </LargeButton>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

