"use client";

interface ImportButtonProps {
  onImport: () => void;
}

export default function ImportButton({ onImport }: ImportButtonProps) {
  return (
    <button
      onClick={onImport}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50 cursor-pointer w-full sm:w-auto justify-center"
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
  );
}
