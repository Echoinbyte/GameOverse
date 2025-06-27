"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dataset,
  GamePair,
  FlashcardProgress,
  FlashcardSession,
  FlashcardSettings,
  MasteryLevel,
} from "@/types";
import {
  saveFlashcardProgress,
  getFlashcardProgress,
  saveFlashcardSession,
} from "@/lib/indexedDB";

export interface FlashcardState {
  currentCardIndex: number;
  isFlipped: boolean;
  isAutoPlaying: boolean;
  cards: GamePair[];
  progress: Record<string, FlashcardProgress>;
  sessionId: string;
}

export interface FlashcardActions {
  nextCard: () => void;
  previousCard: () => void;
  flipCard: () => void;
  markCorrect: () => void;
  markIncorrect: () => void;
  shuffleCards: () => void;
  toggleAutoPlay: () => void;
  resetSession: () => void;
  goToCard: (index: number) => void;
  speak: (text: string) => void;
}

const defaultSettings: FlashcardSettings = {
  autoPlay: false,
  autoPlayDelay: 3000,
  shuffle: false,
  showProgress: true,
  ttsEnabled: false,
  ttsVoice: undefined,
  ttsRate: 1,
  ttsVolume: 1,
  cardColors: {
    front: "#3b82f6",
    back: "#10b981",
  },
  showHints: true,
};

export function useFlashcards(
  datasets: Dataset[],
  settings: FlashcardSettings = defaultSettings
) {
  const [state, setState] = useState<FlashcardState>({
    currentCardIndex: 0,
    isFlipped: false,
    isAutoPlaying: false,
    cards: [],
    progress: {},
    sessionId: `session-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`,
  });

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<Date>(new Date());

  // Initialize cards from datasets
  useEffect(() => {
    if (datasets.length === 0) {
      setState((prev) => ({
        ...prev,
        cards: [],
        currentCardIndex: 0,
        isFlipped: false,
        progress: {},
      }));
      return;
    }

    const allCards = datasets.flatMap((dataset) => dataset.pairs);
    if (allCards.length === 0) {
      setState((prev) => ({
        ...prev,
        cards: [],
        currentCardIndex: 0,
        isFlipped: false,
        progress: {},
      }));
      return;
    }

    const shuffledCards = settings.shuffle
      ? shuffleArray([...allCards])
      : allCards;

    setState((prev) => ({
      ...prev,
      cards: shuffledCards,
      currentCardIndex: 0,
      isFlipped: false,
    }));

    sessionStartTime.current = new Date();
  }, [datasets, settings.shuffle]);

  // Load existing progress for cards when datasets change
  useEffect(() => {
    const loadProgress = async () => {
      if (state.cards.length === 0) return;

      const progressMap: Record<string, FlashcardProgress> = {};

      for (const card of state.cards) {
        try {
          const progress = await getFlashcardProgress(card.id);
          if (progress) {
            progressMap[card.id] = progress;
          } else {
            // Initialize new progress
            progressMap[card.id] = {
              cardId: card.id,
              correctCount: 0,
              incorrectCount: 0,
              lastReviewed: new Date(),
              masteryLevel: MasteryLevel.NEW,
              timeSpent: 0,
            };
          }
        } catch (error) {
          console.error(`Failed to load progress for card ${card.id}:`, error);
          // Initialize with default progress on error
          progressMap[card.id] = {
            cardId: card.id,
            correctCount: 0,
            incorrectCount: 0,
            lastReviewed: new Date(),
            masteryLevel: MasteryLevel.NEW,
            timeSpent: 0,
          };
        }
      }

      setState((prev) => ({ ...prev, progress: progressMap }));
    };

    // Only load progress after cards are set
    if (state.cards.length > 0) {
      loadProgress();
    }
  }, [state.cards]);

  // Text-to-Speech functionality
  const speak = useCallback(
    (text: string) => {
      if (!settings.ttsEnabled) {
        return;
      }

      if (!window.speechSynthesis) {
        console.error("Speech synthesis not supported in this browser");
        return;
      }

      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = settings.ttsRate;
        utterance.volume = settings.ttsVolume;

        if (settings.ttsVoice) {
          const voices = window.speechSynthesis.getVoices();
          const voice = voices.find((v) => v.name === settings.ttsVoice);
          if (voice) utterance.voice = voice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("TTS Error:", error);
      }
    },
    [
      settings.ttsEnabled,
      settings.ttsVoice,
      settings.ttsRate,
      settings.ttsVolume,
    ]
  );

  // Card navigation
  const nextCard = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentCardIndex: (prev.currentCardIndex + 1) % prev.cards.length,
      isFlipped: false,
    }));
  }, []);

  const previousCard = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentCardIndex:
        prev.currentCardIndex === 0
          ? prev.cards.length - 1
          : prev.currentCardIndex - 1,
      isFlipped: false,
    }));
  }, []);

  const goToCard = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      currentCardIndex: Math.max(0, Math.min(index, prev.cards.length - 1)),
      isFlipped: false,
    }));
  }, []);

  const flipCard = useCallback(() => {
    setState((prev) => ({ ...prev, isFlipped: !prev.isFlipped }));
  }, []);

  // Progress tracking
  const updateProgress = useCallback(
    async (cardId: string, isCorrect: boolean) => {
      try {
        const currentProgress = state.progress[cardId];
        if (!currentProgress) return;

        // Simple logic: if "Know" clicked = mastered, if "Still learning" = learning
        const updatedProgress: FlashcardProgress = {
          ...currentProgress,
          correctCount: isCorrect ? 1 : 0,
          incorrectCount: isCorrect ? 0 : 1,
          lastReviewed: new Date(),
          masteryLevel: calculateMasteryLevel(
            isCorrect ? 1 : 0,
            isCorrect ? 0 : 1
          ),
          timeSpent: currentProgress.timeSpent + 1000,
        };

        // Save to IndexedDB first
        await saveFlashcardProgress(updatedProgress);

        // Then update state
        setState((prev) => ({
          ...prev,
          progress: {
            ...prev.progress,
            [cardId]: updatedProgress,
          },
        }));
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    },
    [state.progress]
  );

  const markCorrect = useCallback(() => {
    const currentCard = state.cards[state.currentCardIndex];
    if (currentCard) {
      updateProgress(currentCard.id, true);
    }
  }, [state.cards, state.currentCardIndex, updateProgress]);

  const markIncorrect = useCallback(() => {
    const currentCard = state.cards[state.currentCardIndex];
    if (currentCard) {
      updateProgress(currentCard.id, false);
    }
  }, [state.cards, state.currentCardIndex, updateProgress]);

  // Utility functions
  const shuffleCards = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cards: shuffleArray([...prev.cards]),
      currentCardIndex: 0,
      isFlipped: false,
    }));
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setState((prev) => ({ ...prev, isAutoPlaying: !prev.isAutoPlaying }));
  }, []);

  const resetSession = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentCardIndex: 0,
      isFlipped: false,
      isAutoPlaying: false,
      sessionId: `session-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    }));
    sessionStartTime.current = new Date();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (settings.autoPlay && !state.isFlipped) {
      autoPlayTimerRef.current = setTimeout(() => {
        flipCard();
      }, settings.autoPlayDelay);
    } else if (settings.autoPlay && state.isFlipped) {
      autoPlayTimerRef.current = setTimeout(() => {
        nextCard();
      }, settings.autoPlayDelay);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [
    settings.autoPlay,
    state.isFlipped,
    state.currentCardIndex,
    settings.autoPlayDelay,
    flipCard,
    nextCard,
  ]);

  // Save session on unmount or significant changes
  useEffect(() => {
    const saveSession = async () => {
      if (state.cards.length === 0) return;

      const session: FlashcardSession = {
        id: state.sessionId,
        datasetIds: datasets.map((d) => d.id),
        cards: state.cards,
        progress: state.progress,
        startTime: sessionStartTime.current,
        settings,
      };

      try {
        await saveFlashcardSession(session);
      } catch (error) {
        console.error("Failed to save session:", error);
      }
    };

    const saveTimer = setTimeout(saveSession, 1000); // Debounce saves
    return () => clearTimeout(saveTimer);
  }, [state, datasets, settings]);

  const actions: FlashcardActions = {
    nextCard,
    previousCard,
    flipCard,
    markCorrect,
    markIncorrect,
    shuffleCards,
    toggleAutoPlay,
    resetSession,
    goToCard,
    speak,
  };

  return {
    state,
    actions,
    currentCard: state.cards[state.currentCardIndex] || null,
    totalCards: state.cards.length,
    progressStats: calculateProgressStats(state.progress),
  };
}

// Helper functions
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function calculateMasteryLevel(
  correctCount: number,
  incorrectCount: number
): MasteryLevel {
  // Simple logic: if they marked it as "Know" (correct), it's mastered
  // If they marked it as "Still learning" (incorrect), it's learning
  if (correctCount > 0) return MasteryLevel.MASTERED; // Know
  if (incorrectCount > 0) return MasteryLevel.LEARNING; // Still learning
  return MasteryLevel.NEW; // Never answered
}

function calculateProgressStats(progress: Record<string, FlashcardProgress>) {
  const progressArray = Object.values(progress);
  const total = progressArray.length;

  if (total === 0) {
    return {
      total: 0,
      mastered: 0, // "Know" count
      learning: 0, // "Still learning" count
      accuracy: 0,
    };
  }

  // Simple counts: mastered = "Know", learning = "Still learning"
  const mastered = progressArray.filter(
    (p) => p.masteryLevel === MasteryLevel.MASTERED
  ).length;
  const learning = progressArray.filter(
    (p) => p.masteryLevel === MasteryLevel.LEARNING
  ).length;

  const totalCorrect = progressArray.reduce(
    (sum, p) => sum + p.correctCount,
    0
  );
  const totalAttempts = progressArray.reduce(
    (sum, p) => sum + p.correctCount + p.incorrectCount,
    0
  );
  const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

  return {
    total,
    mastered, // "Know" counter
    learning, // "Still learning" counter
    accuracy: Math.round(accuracy),
  };
}
