import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { memoryBookService, MemoryCategory, MemoryItemInput } from '../services/MemoryBookService';
import { MemoryItem } from '../database/db';

interface Props { onBack?: () => void; onNavigate?: (s: string) => void; }
export default function MemoryBookScreen({ onBack, onNavigate }: Props) {
  
  const { state } = useApp();
  const userId = Number(state.currentPatient?.id) || 1;

  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'all'>('all');
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MemoryItem | null>(null);

  // Form state
  const [formData, setFormData] = useState<MemoryItemInput>({
    userId: userId || 1,
    category: 'family',
    title: '',
    subject: '',
    description: '',
    imageData: undefined,
    date: '',
  });

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
      setMemoryItems(items);
    } catch (error) {
      console.error('Failed to load memory items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await memoryBookService.processImage(file);
      setFormData({ ...formData, imageData });
    } catch (error) {
      console.error('Failed to process image:', error);
      alert('Failed to process image. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      if (editingItem) {
        await memoryBookService.updateMemoryItem(editingItem.id!, {
          ...formData,
          userId,
        });
      } else {
        await memoryBookService.createMemoryItem({
          ...formData,
          userId,
        });
      }

      resetForm();
      await loadMemoryItems();
    } catch (error) {
      console.error('Failed to save memory item:', error);
      alert('Failed to save memory item. Please try again.');
    }
  };

  const handleEdit = (item: MemoryItem) => {
    setEditingItem(item);
    setFormData({
      userId: item.userId,
      category: item.category,
      title: item.title,
      subject: item.subject,
      description: item.description,
      imageData: item.imageData,
      date: item.date || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this memory item?')) return;

    try {
      await memoryBookService.deleteMemoryItem(id);
      await loadMemoryItems();
    } catch (error) {
      console.error('Failed to delete memory item:', error);
      alert('Failed to delete memory item. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      userId: userId || 0,
      category: 'family',
      title: '',
      subject: '',
      description: '',
      imageData: undefined,
      date: '',
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleCreateSampleMemories = async () => {
    if (!userId) return;
    if (!confirm('This will add sample memory items for demonstration. Continue?')) return;

    try {
      await memoryBookService.createSampleMemories(userId);
      await loadMemoryItems();
      alert('Sample memories created successfully!');
    } catch (error) {
      console.error('Failed to create sample memories:', error);
      alert('Failed to create sample memories. Please try again.');
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
        <div className="text-center bg-[var(--color-card)] p-8 rounded-3xl border-2 border-[var(--color-border)] shadow-md max-w-sm w-full">
          <p className="text-[var(--color-text-secondary)] font-medium text-lg">No patient selected</p>
          <button
            type="button"
            onClick={() => onNavigate?.('home')}
            className="mt-6 w-full min-h-[52px] px-6 py-3 bg-gradient-to-b from-emerald-600 to-emerald-700 text-white rounded-2xl font-bold border-2 border-emerald-500/80 shadow-md active:translate-y-0.5"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const categories = memoryBookService.getAllCategories();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-44 sm:pb-52">
      {/* Header */}
      <header className="bg-[var(--color-card)] border-b-2 border-[var(--color-border)] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('home') : onBack?.())}
                className="min-h-[52px] min-w-[52px] flex items-center justify-center p-3 bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] rounded-2xl transition-all border-2 border-[var(--color-border)] shadow-sm active:translate-y-0.5 active:scale-95"
                aria-label="Back"
              >
                <ArrowLeft className="w-6 h-6 text-[var(--color-text)]" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">Memory Book Manager</h1>
                <p className="text-sm md:text-base text-[var(--color-text-secondary)] font-medium">Add and organize personal memory anchors</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('memory-book-viewer')}
                  className="min-h-[50px] px-4 py-2.5 bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text)] font-bold rounded-2xl border-2 border-[var(--color-border)] transition-all active:translate-y-0.5 shadow-sm text-sm flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Open Viewer</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCreateSampleMemories}
                className="min-h-[50px] px-4 py-2.5 bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 transition-all active:translate-y-0.5 shadow-sm text-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sample Anchors</span>
              </button>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="min-h-[50px] flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-2xl shadow-md border-2 border-emerald-500/80 transition-all active:translate-y-0.5 active:scale-[0.99] text-sm"
                style={{ boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)' }}
              >
                <Plus className="w-5 h-5" />
                <span>Add Memory</span>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2.5 mt-5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`min-h-[44px] px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all border-2 active:translate-y-0.5 ${
                selectedCategory === 'all'
                  ? 'bg-[var(--color-success)] border-emerald-600 text-white shadow-md'
                  : 'bg-[var(--color-card)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-success)]'
              }`}
            >
              All ({memoryItems.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[44px] px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 border-2 active:translate-y-0.5 ${
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
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Form */}
        {showForm && (
          <div className="bg-[var(--color-card)] rounded-3xl shadow-md border-2 border-[var(--color-border)] p-6 md:p-8 mb-8">
            <h2 className="text-xl md:text-2xl font-extrabold text-[var(--color-text)] mb-6">
              {editingItem ? 'Edit Memory Item' : 'Add New Memory Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-text)] mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as MemoryCategory })}
                  className="w-full px-4 py-3 bg-[var(--color-card)] text-[var(--color-text)] border-2 border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-medium text-base"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {memoryBookService.getCategoryIcon(category)} {memoryBookService.getCategoryDisplayName(category)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-text)] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Anita, Our Home, Wedding Day"
                  className="w-full px-4 py-3 bg-[var(--color-card)] text-[var(--color-text)] border-2 border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-medium text-base"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-text)] mb-2">
                  Person / Place / Object *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Eldest Daughter, Family House in Guwahati, Wedding Ring"
                  className="w-full px-4 py-3 bg-[var(--color-card)] text-[var(--color-text)] border-2 border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-medium text-base"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-text)] mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Write a clear, loving memory description that the app can speak aloud..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--color-card)] text-[var(--color-text)] border-2 border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-medium text-base leading-relaxed"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-text)] mb-2">
                  Date or Year (optional)
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--color-card)] text-[var(--color-text)] border-2 border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-medium text-base"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-bold text-[var(--color-text)] mb-2">
                  Photo (optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="min-h-[48px] flex items-center gap-2 px-5 py-2.5 bg-[var(--color-bg-subtle)] text-[var(--color-text)] border-2 border-[var(--color-border)] rounded-xl hover:border-emerald-500 cursor-pointer transition-colors font-bold text-sm shadow-sm active:translate-y-0.5">
                    <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Choose Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  {formData.imageData && (
                    <div className="relative">
                      <img
                        src={formData.imageData}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-xl border-2 border-[var(--color-border)]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 min-h-[52px] px-6 py-3 border-2 border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-card)] rounded-2xl hover:bg-[var(--color-bg-subtle)] transition-all font-bold text-base active:translate-y-0.5 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[52px] px-6 py-3 bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl transition-all font-bold text-base active:translate-y-0.5 shadow-md border-2 border-emerald-500/80"
                  style={{ boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)' }}
                >
                  {editingItem ? 'Update Memory' : 'Save Memory'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Memory Items List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
            <p className="text-[var(--color-text-secondary)] mt-4 font-medium">Loading memory anchors...</p>
          </div>
        ) : memoryItems.length === 0 ? (
          <div className="text-center py-16 bg-[var(--color-card)] rounded-3xl border-2 border-[var(--color-border)] p-8">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-xl font-bold text-[var(--color-text)]">No memory items yet</p>
            <p className="text-[var(--color-text-secondary)] mt-2 font-medium max-w-md mx-auto">
              Add family photos and familiar faces to create a personal memory book for cognitive grounding.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {memoryItems.map((item) => (
              <div key={item.id} className="bg-[var(--color-card)] rounded-2xl shadow-sm border-2 border-[var(--color-border)] overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
                {item.imageData ? (
                  <img
                    src={item.imageData}
                    alt={item.title}
                    className="w-full h-52 object-cover border-b-2 border-[var(--color-border)]"
                  />
                ) : (
                  <div className="h-44 bg-[var(--color-bg-subtle)] flex items-center justify-center text-5xl border-b-2 border-[var(--color-border)]">
                    {memoryBookService.getCategoryIcon(item.category)}
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{memoryBookService.getCategoryIcon(item.category)}</span>
                      <h3 className="text-lg md:text-xl font-extrabold text-[var(--color-text)]">{item.title}</h3>
                    </div>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{item.subject}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed line-clamp-3">{item.description}</p>
                    {item.date && (
                      <p className="text-xs text-[var(--color-text-muted)] font-medium mt-2">{item.date}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-[var(--color-border)]">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 text-indigo-600 dark:text-indigo-400 bg-[var(--color-card)] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl border-2 border-[var(--color-border)] hover:border-indigo-400 transition-colors active:scale-95 shadow-sm"
                      aria-label="Edit memory"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id!)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 text-red-600 dark:text-red-400 bg-[var(--color-card)] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl border-2 border-[var(--color-border)] hover:border-red-400 transition-colors active:scale-95 shadow-sm"
                      aria-label="Delete memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
