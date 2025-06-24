"use client";

import { CheckCircle, Download, Edit3, Trash2, Database } from "lucide-react";
import { Dataset } from "@/types";
import { useDatasetSelection } from "@/contexts/DatasetContext";
import { useRouter } from "next/navigation";

interface DatasetCardProps {
  dataset: Dataset;
  onDelete: (id: string, name: string) => void;
  onExport: (dataset: Dataset) => void;
}

export default function DatasetCard({
  dataset,
  onDelete,
  onExport,
}: DatasetCardProps) {
  const { toggleDatasetSelection, isDatasetSelected } = useDatasetSelection();
  const router = useRouter();

  const isSelected = isDatasetSelected(dataset.id);

  const handleSelect = () => {
    toggleDatasetSelection(dataset);
  };
  const handleEdit = () => {
    router.push(`/dataset-editor?id=${dataset.id}`);
  };
  return (
    <div className="group block transform transition-all duration-500 hover:scale-105">
      <div
        className={`
        bg-white/10 backdrop-blur-xl rounded-3xl border transition-all duration-500 p-8 h-full relative overflow-hidden group-hover:shadow-2xl
        ${
          isSelected
            ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50 shadow-xl shadow-green-500/25"
            : "border-white/20 hover:bg-white/15 hover:border-white/30"
        }
      `}
      >
        {/* Dataset Icon */}
        <div
          className={`
          w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-8 mx-auto shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 relative overflow-hidden
          ${isSelected ? "ring-4 ring-green-400/50" : ""}
        `}
        >
          <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
          <Database className="w-8 h-8 text-white relative z-10" />
        </div>
        {/* Dataset Info */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors duration-300 truncate">
            {dataset.name}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-center items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1">
                <span>Pairs:</span>
                <span className="text-blue-400 font-semibold">
                  {dataset.pairs.length}
                </span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                {new Date(dataset.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>{" "}
        {/* Selection Button */}
        <div className="transition-all duration-300 mb-4">
          <button
            onClick={handleSelect}
            className={`
              w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl backdrop-blur-sm border transition-all duration-300 cursor-pointer
              ${
                isSelected
                  ? "bg-green-500/30 border-green-400/50 text-green-300 shadow-lg"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }
            `}
          >
            {isSelected ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">Selected</span>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold">Select Dataset</span>
              </>
            )}
          </button>
        </div>{" "}
        {/* Action Buttons */}
        <div className="transition-all duration-300">
          <div className="flex gap-2">
            <button
              onClick={() => onExport(dataset)}
              className="flex-1 p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 hover:text-purple-300 transition-all duration-200 cursor-pointer"
              title="Export dataset"
            >
              <Download className="w-4 h-4 mx-auto" />
            </button>{" "}
            <button
              onClick={handleEdit}
              className="flex-1 p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-200 cursor-pointer"
              title="Edit dataset"
            >
              <Edit3 className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => onDelete(dataset.id, dataset.name)}
              className="flex-1 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200 cursor-pointer"
              title="Delete dataset"
            >
              <Trash2 className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
