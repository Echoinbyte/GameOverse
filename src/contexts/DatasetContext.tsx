"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Dataset } from "@/types";

interface DatasetContextType {
  selectedDatasets: Dataset[];
  setSelectedDatasets: (datasets: Dataset[]) => void;
  toggleDatasetSelection: (dataset: Dataset) => void;
  clearSelection: () => void;
  isDatasetSelected: (datasetId: string) => boolean;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([]);

  const toggleDatasetSelection = (dataset: Dataset) => {
    setSelectedDatasets((prev) => {
      const isSelected = prev.some((d) => d.id === dataset.id);
      if (isSelected) {
        return prev.filter((d) => d.id !== dataset.id);
      } else {
        return [...prev, dataset];
      }
    });
  };

  const clearSelection = () => {
    setSelectedDatasets([]);
  };

  const isDatasetSelected = (datasetId: string) => {
    return selectedDatasets.some((d) => d.id === datasetId);
  };

  return (
    <DatasetContext.Provider
      value={{
        selectedDatasets,
        setSelectedDatasets,
        toggleDatasetSelection,
        clearSelection,
        isDatasetSelected,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
}

export function useDatasetSelection() {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error(
      "useDatasetSelection must be used within a DatasetProvider"
    );
  }
  return context;
}
