export interface LearningTool {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  slug: string;
  gradient: string;
}

export interface GamePair {
  id: string;
  term: string;
  definition: string;
}

export interface Dataset {
  id: string;
  name: string;
  pairs: GamePair[];
  createdAt: Date;
  updatedAt: Date;
}

// Flashcard-specific types
export interface FlashcardProgress {
  cardId: string;
  correctCount: number;
  incorrectCount: number;
  lastReviewed: Date;
  masteryLevel: MasteryLevel;
  timeSpent: number; // in milliseconds
}

export enum MasteryLevel {
  NEW = 'new',
  LEARNING = 'learning',
  REVIEWING = 'reviewing',
  MASTERED = 'mastered'
}

export interface FlashcardSession {
  id: string;
  datasetIds: string[];
  cards: GamePair[];
  progress: Record<string, FlashcardProgress>;
  startTime: Date;
  endTime?: Date;
  settings: FlashcardSettings;
}

export interface FlashcardSettings {
  autoPlay: boolean;
  autoPlayDelay: number; // in milliseconds
  shuffle: boolean;
  showProgress: boolean;
  showHints: boolean;
  ttsEnabled: boolean;
  ttsVoice?: string;
  ttsRate: number;
  ttsVolume: number;
  cardColors: {
    front: string;
    back: string;
  };
}

export interface SelectedDatasets {
  datasetIds: string[];
  lastUpdated: Date;
}
