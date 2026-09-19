import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { memoryBookService, MemoryCategory, MemoryItemInput } from '../services/MemoryBookService';
import { MemoryItem } from '../database/db';
import { formatDate } from '../utils/dateUtils';

export default function MemoryBookScreen() {
  const navigate = useNavigate();
  const { state } = useApp();
  const userId = state.currentPatient?.id ? parseInt(state.currentPatient.id) : null;

  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'all'>('all');
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MemoryItem | null>(null);

  // Form state
  const [formData, setFormData] = useState<MemoryItemInput>({
    userId: userId || 0,
    category: 'family',
    title: '',
    subject: '',
    description: '',
    imageData: undefined,
    date: '',
  });

  useEffect(() => {
    if (userId) {
      loadMemoryItems();
    }
  }, [userId, selectedCategory]);

  const loadMemoryItems = async () => {
    if (!userId) return;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No patient selected</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const categories = memoryBookService.getAllCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Memory Book</h1>
                <p className="text-gray-600 mt-1">Manage memory anchors</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateSampleMemories}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
              >
                Add Sample Memories
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Memory</span>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({memoryItems.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{memoryBookService.getCategoryIcon(category)}</span>
                <span>{memoryBookService.getCategoryDisplayName(category)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingItem ? 'Edit Memory Item' : 'Add New Memory Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as MemoryCategory })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Anita, Our Home, Wedding Day"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Person/Place/Object *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Daughter, Family House, Wedding Ring"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Write a short description..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date (optional)
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo (optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                    <ImageIcon className="w-5 h-5" />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  {formData.imageData && (
                    <img
                      src={formData.imageData}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  {editingItem ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Memory Items List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading memory items...</p>
          </div>
        ) : memoryItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-gray-600 text-lg">No memory items yet</p>
            <p className="text-gray-500 mt-2">Add memories to create a personal memory book</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memoryItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {item.imageData && (
                  <img
                    src={item.imageData}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{memoryBookService.getCategoryIcon(item.category)}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{item.subject}</p>
                      <p className="text-sm text-gray-700 mt-2">{item.description}</p>
                      {item.date && (
                        <p className="text-xs text-gray-500 mt-2">{item.date}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
