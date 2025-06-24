"use client";

interface SelectionIndicatorProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export default function SelectionIndicator({
  selectedCount,
  onClearSelection,
}: SelectionIndicatorProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 border border-green-400/50">
      <div className="w-2 h-2 rounded-full bg-green-400"></div>
      <span className="text-green-300 text-sm font-medium">
        {selectedCount} dataset{selectedCount === 1 ? "" : "s"} selected
      </span>
      <button
        onClick={onClearSelection}
        className="ml-2 text-green-400 hover:text-green-300 transition-colors cursor-pointer"
        title="Clear selection"
      >
        ×
      </button>
    </div>
  );
}
