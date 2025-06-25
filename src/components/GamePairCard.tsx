import { Trash2 } from "lucide-react";
import { GamePair } from "@/types";

interface GamePairCardProps {
  pair: GamePair;
  index: number;
  onUpdate: (id: string, field: "term" | "definition", value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export default function GamePairCard({
  pair,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: GamePairCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 relative group hover:bg-white/15 transition-all duration-300">
      {/* Card Number */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
        {index + 1}
      </div>

      {/* Remove Button */}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(pair.id)}
          className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Term */}
        <div>
          <label className="block text-white text-sm font-semibold mb-3">
            Term
          </label>
          <input
            type="text"
            value={pair.term}
            onChange={(e) => onUpdate(pair.id, "term", e.target.value)}
            placeholder="Enter the term..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all duration-300"
            required
          />
        </div>

        {/* Definition */}
        <div>
          <label className="block text-white text-sm font-semibold mb-3">
            Definition
          </label>
          <textarea
            value={pair.definition}
            onChange={(e) => onUpdate(pair.id, "definition", e.target.value)}
            placeholder="Enter the definition..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all duration-300 resize-none"
            required
          />
        </div>
      </div>
    </div>
  );
}
