"use client";

import ImportButton from "./ImportButton";
import SelectionIndicator from "./SelectionIndicator";

interface DatasetsHeaderProps {
  selectedCount: number;
  onImport: () => void;
  onClearSelection: () => void;
}

export default function DatasetsHeader({
  selectedCount,
  onImport,
  onClearSelection,
}: DatasetsHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex-1">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
          My Learning Datasets
        </h2>
        <p className="text-slate-400 text-sm">
          Create, import, and manage your personalized learning content
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:flex-shrink-0">
        <ImportButton onImport={onImport} />
        <SelectionIndicator
          selectedCount={selectedCount}
          onClearSelection={onClearSelection}
        />
      </div>
    </div>
  );
}
