import { Brain, CreditCard, Target, Zap } from "lucide-react";
import { LearningTool } from "@/types";

export const learningTools: LearningTool[] = [
  {
    title: "Blast",
    description: "Fast-paced knowledge challenges to test your quick thinking",
    icon: Zap,
    slug: "/",
    gradient: "from-orange-400 via-red-400 to-pink-400",
  },
  {
    title: "Quiz",
    description: "Dynamic quizzes with real-time feedback and scoring",
    icon: Brain,
    slug: "/",
    gradient: "from-blue-400 via-purple-400 to-indigo-400",
  },
  {
    title: "Match",
    description: "Memory and association games for concept reinforcement",
    icon: Target,
    slug: "/",
    gradient: "from-green-400 via-emerald-400 to-teal-400",
  },
  {
    title: "FlashCard",
    description: "Spaced repetition learning with customizable card sets",
    icon: CreditCard,
    slug: "/flashcard",
    gradient: "from-purple-400 via-pink-400 to-rose-400",
  },
];
