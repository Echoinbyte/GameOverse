"use client";

import { GamePair } from "@/types";

interface GamePairCardProps {
  pair: GamePair;
  index: number;
  canRemove: boolean;
  onUpdate: (id: string, field: "term" | "definition", value: string) => void;
  onRemove: (id: string) => void;
}

export default function GamePairCard({
  pair,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: GamePairCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
      {/* Hidden inputs for form data */}
      <input type="hidden" name="pairId" value={pair.id} />

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Pair {index + 1}</h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(pair.id)}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Term/Question
          </label>
          <input
            type="text"
            name={`term_${pair.id}`}
            value={pair.term}
            onChange={(e) => onUpdate(pair.id, "term", e.target.value)}
            placeholder="Enter term or question..."
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Definition/Answer
          </label>
          <textarea
            name={`definition_${pair.id}`}
            value={pair.definition}
            onChange={(e) => onUpdate(pair.id, "definition", e.target.value)}
            placeholder="Enter definition or answer..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
            required
          />
        </div>
      </div>
    </div>
  );
}
