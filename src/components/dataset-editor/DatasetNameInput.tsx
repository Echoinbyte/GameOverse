"use client";

interface DatasetNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DatasetNameInput({
  value,
  onChange,
}: DatasetNameInputProps) {
  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-white mb-3">
        Dataset Name
      </label>
      <input
        type="text"
        name="datasetName"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a name for your game set..."
        className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-lg"
        required
      />
    </div>
  );
}
