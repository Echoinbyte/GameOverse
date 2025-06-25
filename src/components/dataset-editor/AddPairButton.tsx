"use client";

interface AddPairButtonProps {
  onAdd: () => void;
}

export default function AddPairButton({ onAdd }: AddPairButtonProps) {
  return (
    <div className="flex items-center justify-center py-6">
      <button
        type="button"
        onClick={onAdd}
        className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-slate-300 hover:text-white transition-all duration-300 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 group-hover:from-green-400/30 group-hover:to-emerald-400/30 flex items-center justify-center transition-all duration-300">
          <svg
            className="w-4 h-4 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <span className="text-sm font-medium">Add Pair</span>
      </button>
    </div>
  );
}
