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
