"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  AlertCircle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Shuffle,
  RotateCcw,
  Volume2,
  X,
  Check,
} from "lucide-react";
import { useDataset } from "@/contexts/DatasetContext";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Dataset, FlashcardSettings } from "@/types";
import { getAllDatasets, getSelectedDatasets } from "@/lib/indexedDB";
import ThreeFlashcard from "@/components/flashcard/ThreeFlashcard";
import FlashcardSettingsPanel from "@/components/flashcard/FlashcardSettingsPanel";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import SavedDatasets from "@/components/home/SavedDatasets";

const defaultSettings: FlashcardSettings = {
  autoPlay: false,
  autoPlayDelay: 3000,
  shuffle: false,
  showProgress: true,
  showHints: true,
  ttsEnabled: true,
  ttsVoice: undefined,
  ttsRate: 1,
  ttsVolume: 1,
  cardColors: {
    front: "#3b82f6",
    back: "#10b981",
  },
};

export default function FlashcardPage() {
  const router = useRouter();
  const { selectedDatasets } = useDataset();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [settings, setSettings] = useState<FlashcardSettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { state, actions, currentCard, totalCards, progressStats } =
    useFlashcards(datasets, settings);

  // Load datasets on component mount
  useEffect(() => {
    const loadDatasets = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let datasetsToLoad: Dataset[] = [];

        // If we have selected datasets from context, use those
        if (selectedDatasets.length > 0) {
          datasetsToLoad = selectedDatasets;
        } else {
          // Otherwise, try to load from IndexedDB
          const savedSelection = await getSelectedDatasets();
          if (savedSelection && savedSelection.datasetIds.length > 0) {
            const allDatasets = await getAllDatasets();
            datasetsToLoad = allDatasets.filter((dataset) =>
              savedSelection.datasetIds.includes(dataset.id)
            );
          }
        }

        if (datasetsToLoad.length === 0) {
          // No datasets selected - we'll show the SavedDatasets component instead of an error
          setDatasets([]);
          return;
        }

        // Validate that datasets have cards
        const datasetsWithCards = datasetsToLoad.filter(
          (dataset) => dataset.pairs.length > 0
        );
        if (datasetsWithCards.length === 0) {
          setError(
            "Selected datasets don't contain any flashcards. Please create some cards first."
          );
          return;
        }

        setDatasets(datasetsWithCards);
      } catch (err) {
        console.error("Failed to load datasets:", err);
        setError("Failed to load datasets. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDatasets();
  }, [selectedDatasets]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showSettings) return; // Don't handle shortcuts when settings panel is open

      switch (event.key) {
        case " ":
        case "Enter":
          event.preventDefault();
          actions.flipCard();
          break;
        case "ArrowLeft":
          event.preventDefault();
          actions.previousCard();
          break;
        case "ArrowRight":
          event.preventDefault();
          actions.nextCard();
          break;
        case "s":
          event.preventDefault();
          actions.shuffleCards();
          break;
        case "r":
          event.preventDefault();
          actions.resetSession();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [actions, state.isFlipped, showSettings]);

  const handleSettingsChange = (newSettings: Partial<FlashcardSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading flashcards..." fullScreen={true} />;
  }

  // If no datasets are selected, show the SavedDatasets component
  if (datasets.length === 0) {
    return <SavedDatasets />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                No Flashcards Available
              </h2>
              <p className="text-slate-300 mb-6 text-sm sm:text-base">
                {error}
              </p>
              <button
                onClick={() => router.push("/")}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 relative z-10">
        {/* Modern Header with Dataset Info, Progress, and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 space-y-4 lg:space-y-0">
          {/* Left: Dataset Info and Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium">
                Flashcards
              </div>
              <div className="text-slate-400 text-sm">
                {state.currentCardIndex + 1} / {totalCards}
              </div>
            </div>
            <div className="text-white font-medium text-base lg:text-lg truncate">
              {datasets.map((d) => d.name).join(", ")}
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500/20 text-orange-300 flex items-center justify-center text-sm font-bold transition-all duration-500 transform hover:scale-110">
                  {progressStats.learning}
                </div>
                <span className="text-orange-300 text-sm font-medium">
                  Still learning
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center text-sm font-bold transition-all duration-500 transform hover:scale-110">
                  {progressStats.mastered}
                </div>
                <span className="text-green-300 text-sm font-medium">Know</span>
              </div>
            </div>
          </div>

          {/* Right: Controls, TTS, and Settings */}
          <div className="flex items-center justify-center lg:justify-end space-x-2 sm:space-x-3">
            {/* TTS Button */}
            <button
              onClick={() => {
                if (currentCard) {
                  // Read the currently visible side
                  const textToSpeak = state.isFlipped
                    ? currentCard.definition
                    : currentCard.term;
                  actions.speak(textToSpeak);
                }
              }}
              className="p-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 text-white cursor-pointer"
              title="Read aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-1">
              <button
                onClick={actions.previousCard}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white cursor-pointer"
                title="Previous card (←)"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, autoPlay: !prev.autoPlay }))
                }
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white cursor-pointer"
                title={settings.autoPlay ? "Pause autoplay" : "Start autoplay"}
              >
                {settings.autoPlay ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={actions.nextCard}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white cursor-pointer"
                title="Next card (→)"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Action Controls */}
            <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-1">
              <button
                onClick={actions.shuffleCards}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white cursor-pointer"
                title="Shuffle cards (S)"
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                onClick={actions.resetSession}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white cursor-pointer"
                title="Reset session (R)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Main Card Area - Full Width */}
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          {/* 3D Flashcard */}
          <div className="relative">
            {currentCard ? (
              <ThreeFlashcard
                card={currentCard}
                isFlipped={state.isFlipped}
                onFlip={actions.flipCard}
                frontColor={settings.cardColors.front}
                backColor={settings.cardColors.back}
                showHints={settings.showHints}
              />
            ) : (
              <div className="w-full h-64 sm:h-96 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center">
                <p className="text-slate-400 text-center px-4">
                  No cards available
                </p>
              </div>
            )}
          </div>

          {/* Mastery Buttons - Only show when card is flipped */}
          {state.isFlipped && currentCard && (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-6 sm:mt-8 px-4">
              <button
                onClick={() => {
                  actions.markIncorrect();
                  actions.nextCard();
                }}
                className="flex items-center justify-center space-x-3 w-full sm:w-auto px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-xl transition-all duration-300 text-red-300 hover:text-red-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
                <span className="font-medium">Still learning</span>
              </button>
              <button
                onClick={() => {
                  actions.markCorrect();
                  actions.nextCard();
                }}
                className="flex items-center justify-center space-x-3 w-full sm:w-auto px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-xl transition-all duration-300 text-green-300 hover:text-green-200 cursor-pointer"
              >
                <Check className="w-5 h-5" />
                <span className="font-medium">Know</span>
              </button>
            </div>
          )}

          {/* Bottom Stats */}
          <div className="mt-4 sm:mt-6 text-center text-slate-400 text-sm px-4">
            {progressStats.accuracy}% accuracy • {progressStats.total} cards
            studied
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <FlashcardSettingsPanel
        settings={settings}
        onSettingsChange={handleSettingsChange}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
