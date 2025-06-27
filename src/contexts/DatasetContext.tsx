"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Dataset } from "@/types";
import {
  saveSelectedDatasets,
  getSelectedDatasets,
  getAllDatasets,
} from "@/lib/indexedDB";

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
  const [isLoaded, setIsLoaded] = useState(false);

  // Load selected datasets from IndexedDB on component mount
  useEffect(() => {
    const loadSelectedDatasets = async () => {
      try {
        const savedSelection = await getSelectedDatasets();
        if (savedSelection && savedSelection.datasetIds.length > 0) {
          // Fetch the actual datasets by their IDs
          const allDatasets = await getAllDatasets();
          const selectedDatasetsData = allDatasets.filter((dataset) =>
            savedSelection.datasetIds.includes(dataset.id)
          );
          setSelectedDatasets(selectedDatasetsData);
        }
      } catch (error) {
        console.error("Failed to load selected datasets:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSelectedDatasets();
  }, []);

  // Save selected datasets to IndexedDB whenever selection changes
  useEffect(() => {
    if (!isLoaded) return;

    const saveSelection = async () => {
      try {
        await saveSelectedDatasets({
          datasetIds: selectedDatasets.map((d) => d.id),
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error("Failed to save selected datasets:", error);
      }
    };

    saveSelection();
  }, [selectedDatasets, isLoaded]);

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

export function useDataset() {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error("useDataset must be used within a DatasetProvider");
  }
  return context;
}

// Keep backward compatibility
export const useDatasetSelection = useDataset;
