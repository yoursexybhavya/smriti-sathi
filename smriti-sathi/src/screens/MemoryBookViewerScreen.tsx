import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { memoryBookService, MemoryCategory } from '../services/MemoryBookService';
import { MemoryItem } from '../database/db';

export default function MemoryBookViewerScreen() {
  const navigate = useNavigate();
  const { state } = useApp();
  const userId = state.currentPatient?.id ? parseInt(state.currentPatient.id) : null;
  const patientName = state.currentPatient?.name;

  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'all'>('all');
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);

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
      setCurrentIndex(0);
    } catch (error) {
      console.error('Failed to load memory items:', error);
    } finally {
      setLoading(false);
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

  const currentItem = memoryItems[currentIndex];
  const categories = memoryBookService.getAllCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Memory Book</h1>
              <p className="text-gray-600 mt-1">Your personal memories</p>
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
              All
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading memories...</p>
          </div>
        ) : memoryItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-gray-600 text-lg">No memories yet</p>
            <p className="text-gray-500 mt-2">Ask a caregiver to add memories for you</p>
          </div>
        ) : currentItem ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Image */}
            {currentItem.imageData ? (
              <img
                src={currentItem.imageData}
                alt={currentItem.title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">{memoryBookService.getCategoryIcon(currentItem.category)}</div>
                  <p className="text-gray-600 text-lg">No photo</p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{memoryBookService.getCategoryIcon(currentItem.category)}</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentItem.title}</h2>
                <p className="text-xl text-gray-700 font-medium">{currentItem.subject}</p>
                {currentItem.date && (
                  <p className="text-sm text-gray-500 mt-2">{currentItem.date}</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-lg text-gray-800 leading-relaxed text-center">
                  {currentItem.description}
                </p>
              </div>

              {/* Hear Description Button */}
              <button
                onClick={handleHearDescription}
                disabled={speaking}
                className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                  speaking
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Volume2 className={`w-6 h-6 ${speaking ? 'animate-pulse' : ''}`} />
                {speaking ? 'Speaking...' : 'Hear Description'}
              </button>
            </div>

            {/* Navigation */}
            <div className="bg-gray-50 px-8 py-6 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {currentIndex + 1} of {memoryItems.length}
                </p>
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === memoryItems.length - 1}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
