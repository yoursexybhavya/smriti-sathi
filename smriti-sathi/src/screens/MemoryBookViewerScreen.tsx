import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { memoryBookService, MemoryCategory } from '../services/MemoryBookService';
import { MemoryItem } from '../database/db';

interface Props {
  onBack?: () => void;
}

export default function MemoryBookViewerScreen({ onBack }: Props) {
  const { state } = useApp();
  // Safe user ID normalization (always valid integer)
  const userId = Number(state.currentPatient?.id) || 1;
  const patientName = state.currentPatient?.name || 'Friend';

  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'all'>('all');
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    loadMemoryItems();
  }, [userId, selectedCategory]);

  const loadMemoryItems = async () => {
    setLoading(true);
    try {
      let items: MemoryItem[];
      if (selectedCategory === 'all') {
        items = await memoryBookService.getAllMemoryItems(userId);
      } else {
        items = await memoryBookService.getMemoryItemsByCategory(userId, selectedCategory);
      }
      setMemoryItems(items || []);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Failed to load memory items:', error);
      setMemoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleMemories = async () => {
    setSeeding(true);
    try {
      await memoryBookService.createSampleMemories(userId);
      await loadMemoryItems();
    } catch (error) {
      console.error('Failed to create sample memories:', error);
    } finally {
      setSeeding(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < memoryItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleHearDescription = async () => {
    if (!memoryItems[currentIndex]) return;

    setSpeaking(true);
    try {
      await memoryBookService.speakMemoryDescription(memoryItems[currentIndex], patientName);
    } catch (error) {
      console.error('Failed to speak description:', error);
    } finally {
      setSpeaking(false);
    }
  };

  const currentItem = memoryItems[currentIndex];
  const categories = memoryBookService.getAllCategories();

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col justify-between">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-[#E0D8CC] px-5 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onBack?.()}
              className="p-3 bg-[#FDF8F0] hover:bg-[#E0D8CC] rounded-2xl transition-colors border border-[#E0D8CC] active:scale-95"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A]">Memory Book</h1>
              <p className="text-sm md:text-base text-[#7A7A7A] font-medium">Personal Memories & Familiar Faces</p>
            </div>
          </div>

          {memoryItems.length > 0 && (
            <span className="text-sm md:text-base font-bold text-[#1B5E20] bg-[#E8F5E9] px-4 py-1.5 rounded-full border border-[#1B5E20]/20">
              {currentIndex + 1} of {memoryItems.length}
            </span>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="max-w-6xl mx-auto flex gap-2.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm md:text-base whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#1B5E20] text-white shadow-md'
                : 'bg-[#FDF8F0] text-[#4A4A4A] border border-[#E0D8CC] hover:border-[#1B5E20]'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm md:text-base whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === category
                  ? 'bg-[#1B5E20] text-white shadow-md'
                  : 'bg-[#FDF8F0] text-[#4A4A4A] border border-[#E0D8CC] hover:border-[#1B5E20]'
              }`}
            >
              <span>{memoryBookService.getCategoryIcon(category)}</span>
              <span>{memoryBookService.getCategoryDisplayName(category)}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Memory Viewer */}
      <main className="flex-1 max-w-6xl mx-auto px-5 py-6 w-full flex flex-col justify-center">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#1B5E20] border-t-transparent mx-auto"></div>
            <p className="text-[#4A4A4A] text-lg font-medium mt-4">Opening your Memory Book...</p>
          </div>
        ) : memoryItems.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-[#E0D8CC] p-8 max-w-xl mx-auto text-center shadow-md space-y-5">
            <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
              📸
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A]">No Memories Added Yet</h2>
              <p className="text-[#555555] text-base mt-2 leading-relaxed">
                Add sample family anchors to experience how Smriti Sathi speaks and displays personal memories.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadSampleMemories}
              disabled={seeding}
              className="w-full py-4 px-6 bg-[#1B5E20] hover:bg-[#144718] text-white text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              <span>{seeding ? 'Generating Sample Anchors...' : 'Add Sample Memories Now'}</span>
            </button>
          </div>
        ) : currentItem ? (
          <div className="bg-white rounded-3xl shadow-lg border-2 border-[#E0D8CC] overflow-hidden md:grid md:grid-cols-2 md:items-stretch">
            {/* Left: Memory Photo or Cultural Icon Placeholder */}
            <div className="relative bg-[#FDF8F0] min-h-[260px] md:min-h-[420px] flex items-center justify-center p-4 border-b-2 md:border-b-0 md:border-r-2 border-[#E0D8CC]">
              {currentItem.imageData ? (
                <img
                  src={currentItem.imageData}
                  alt={currentItem.title}
                  className="w-full h-full object-cover rounded-2xl max-h-[380px]"
                />
              ) : (
                <div className="text-center p-6 space-y-4">
                  <div className="text-7xl md:text-8xl drop-shadow-sm">
                    {memoryBookService.getCategoryIcon(currentItem.category)}
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-white/80 border border-[#E0D8CC] px-3.5 py-1 rounded-full text-xs font-semibold text-[#7A7A7A]">
                    <ImageIcon size={14} />
                    <span>Memory Anchor</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Memory Details, Speech & Navigation Controls */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{memoryBookService.getCategoryIcon(currentItem.category)}</span>
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[#1B5E20] bg-[#E8F5E9] px-3 py-1 rounded-full">
                    {memoryBookService.getCategoryDisplayName(currentItem.category)}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] leading-tight">
                  {currentItem.title}
                </h2>
                <p className="text-lg md:text-xl font-bold text-[#E65100] mt-1">
                  {currentItem.subject}
                </p>
                {currentItem.date && (
                  <p className="text-sm font-medium text-[#7A7A7A] mt-1">
                    {currentItem.date}
                  </p>
                )}

                {/* Description Box */}
                <div className="mt-5 bg-[#FDF8F0] rounded-2xl p-5 border border-[#E0D8CC]">
                  <p className="text-lg md:text-xl text-[#1A1A1A] leading-relaxed font-medium">
                    {currentItem.description}
                  </p>
                </div>
              </div>

              {/* Action: Read Aloud & Navigation */}
              <div className="space-y-4 pt-2">
                <button
                  type="button"
                  onClick={handleHearDescription}
                  disabled={speaking}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-lg md:text-xl transition-all shadow-md active:scale-98 ${
                    speaking
                      ? 'bg-[#E8F5E9] text-[#1B5E20] border-2 border-[#1B5E20]'
                      : 'bg-[#1B5E20] hover:bg-[#144718] text-white'
                  }`}
                >
                  <Volume2 className={`w-6 h-6 ${speaking ? 'animate-pulse' : ''}`} />
                  <span>{speaking ? 'Reading Memory...' : 'Hear Description Aloud'}</span>
                </button>

                {/* Prev & Next Controls */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-[#FDF8F0] border-2 border-[#E0D8CC] text-[#1A1A1A] font-bold rounded-2xl hover:border-[#1B5E20] transition-colors disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentIndex === memoryItems.length - 1}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-[#FDF8F0] border-2 border-[#E0D8CC] text-[#1A1A1A] font-bold rounded-2xl hover:border-[#1B5E20] transition-colors disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
