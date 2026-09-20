import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { memoryBookService, MemoryCategory } from '../services/MemoryBookService';
import { MemoryItem } from '../database/db';

interface Props {
  onBack?: () => void;
  onNavigate?: (s: string) => void;
}

export default function MemoryBookViewerScreen({ onBack, onNavigate }: Props) {
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
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-between">
      {/* Top Navigation Header */}
      <header className="bg-[var(--color-card)] border-b-2 border-[var(--color-border)] px-5 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onBack?.()}
              className="min-h-[52px] min-w-[52px] flex items-center justify-center p-3 bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] rounded-2xl transition-all border-2 border-[var(--color-border)] shadow-sm active:translate-y-0.5 active:scale-95"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-6 h-6 text-[var(--color-text)]" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">Memory Book</h1>
              <p className="text-sm md:text-base text-[var(--color-text-secondary)] font-medium">Personal Memories & Familiar Faces</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {memoryItems.length > 0 && (
              <span className="text-sm md:text-base font-bold text-[var(--color-success)] bg-[var(--color-success-bg)] px-4 py-2 rounded-full border-2 border-[var(--color-success)]/30 shadow-sm">
                {currentIndex + 1} of {memoryItems.length}
              </span>
            )}
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('memory-book')}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 min-h-[52px] bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text)] font-bold text-sm rounded-xl border-2 border-[var(--color-border)] shadow-sm active:translate-y-0.5 transition-all"
              >
                <span>Edit Memories</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="max-w-6xl mx-auto flex gap-2.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[48px] px-5 py-2.5 rounded-2xl font-bold text-sm md:text-base whitespace-nowrap transition-all border-2 active:translate-y-0.5 ${
              selectedCategory === 'all'
                ? 'bg-[var(--color-success)] border-emerald-600 text-white shadow-md'
                : 'bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-success)]'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`min-h-[48px] px-5 py-2.5 rounded-2xl font-bold text-sm md:text-base whitespace-nowrap transition-all flex items-center gap-2 border-2 active:translate-y-0.5 ${
                selectedCategory === category
                  ? 'bg-[var(--color-success)] border-emerald-600 text-white shadow-md'
                  : 'bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-success)]'
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
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[var(--color-success)] border-t-transparent mx-auto"></div>
            <p className="text-[var(--color-text-secondary)] text-lg font-medium mt-4">Opening your Memory Book...</p>
          </div>
        ) : memoryItems.length === 0 ? (
          <div className="bg-[var(--color-card)] rounded-3xl border-2 border-[var(--color-border)] p-8 max-w-xl mx-auto text-center shadow-md space-y-5">
            <div className="w-20 h-20 bg-[var(--color-success-bg)] rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
              📸
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">No Memories Added Yet</h2>
              <p className="text-[var(--color-text-secondary)] text-base mt-2 leading-relaxed">
                Add sample family anchors to experience how Smriti Sathi speaks and displays personal memories.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadSampleMemories}
              disabled={seeding}
              className="w-full min-h-[58px] py-4 px-6 bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg font-bold rounded-2xl shadow-lg border-2 border-emerald-500/80 transition-all active:translate-y-1 active:scale-[0.99] flex items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)' }}
            >
              <Sparkles size={22} />
              <span>{seeding ? 'Generating Sample Anchors...' : 'Add Sample Memories Now'}</span>
            </button>
          </div>
        ) : currentItem ? (
          <div className="bg-[var(--color-card)] rounded-3xl shadow-lg border-2 border-[var(--color-border)] overflow-hidden md:grid md:grid-cols-2 md:items-stretch">
            {/* Left: Memory Photo or Cultural Icon Placeholder */}
            <div className="relative bg-[var(--color-card-subtle)] min-h-[260px] md:min-h-[420px] flex items-center justify-center p-4 border-b-2 md:border-b-0 md:border-r-2 border-[var(--color-border)]">
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
                  <div className="inline-flex items-center gap-1.5 bg-[var(--color-card)]/90 border border-[var(--color-border)] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--color-text-secondary)]">
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
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[var(--color-success)] bg-[var(--color-success-bg)] px-3 py-1 rounded-full border border-[var(--color-success)]/20">
                    {memoryBookService.getCategoryDisplayName(currentItem.category)}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text)] leading-tight">
                  {currentItem.title}
                </h2>
                <p className="text-lg md:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {currentItem.subject}
                </p>
                {currentItem.date && (
                  <p className="text-sm font-medium text-[var(--color-text-muted)] mt-1">
                    {currentItem.date}
                  </p>
                )}

                {/* Description Box */}
                <div className="mt-5 bg-[var(--color-card-subtle)] rounded-2xl p-5 border-2 border-[var(--color-border)]">
                  <p className="text-lg md:text-xl text-[var(--color-text)] leading-relaxed font-medium">
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
                  className={`w-full min-h-[58px] flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-lg md:text-xl transition-all shadow-md active:translate-y-0.5 active:scale-[0.99] border-2 ${
                    speaking
                      ? 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)] shadow-inner'
                      : 'bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-emerald-500/80 shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
                  }`}
                  style={{
                    boxShadow: speaking ? undefined : '0 4px 12px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Volume2 className={`w-6 h-6 ${speaking ? 'animate-pulse' : ''}`} />
                  <span>{speaking ? 'Reading Memory Aloud...' : 'Hear Story Aloud'}</span>
                </button>

                {/* Prev & Next Controls */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex-1 min-h-[56px] flex items-center justify-center gap-2 py-3.5 px-4 bg-[var(--color-card)] border-2 border-[var(--color-border)] text-[var(--color-text)] font-bold rounded-2xl hover:border-emerald-500 transition-all disabled:opacity-40 disabled:pointer-events-none active:translate-y-0.5 active:scale-[0.99] shadow-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                    <span className="text-base md:text-lg">Previous</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentIndex === memoryItems.length - 1}
                    className="flex-1 min-h-[56px] flex items-center justify-center gap-2 py-3.5 px-4 bg-[var(--color-card)] border-2 border-[var(--color-border)] text-[var(--color-text)] font-bold rounded-2xl hover:border-emerald-500 transition-all disabled:opacity-40 disabled:pointer-events-none active:translate-y-0.5 active:scale-[0.99] shadow-sm"
                  >
                    <span className="text-base md:text-lg">Next</span>
                    <ChevronRight className="w-6 h-6" />
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
