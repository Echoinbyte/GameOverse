"use client";

interface EmptyStateProps {
  onImport: () => void;
}

export default function EmptyState({ onImport }: EmptyStateProps) {
  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
            My Learning Datasets
          </h2>
          <p className="text-slate-400 text-sm">
            Create, import, and manage your personalized learning content
          </p>
        </div>
        <button
          onClick={onImport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          <span className="text-sm font-medium">Import Dataset</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            No datasets yet
          </h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Get started by creating your first dataset or importing existing
            ones to begin your learning journey.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/dataset-editor"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
            >
              Create New Dataset
            </a>
            <button
              onClick={onImport}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold border border-white/20 hover:border-white/30 transition-all duration-300 cursor-pointer"
            >
              Import Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
