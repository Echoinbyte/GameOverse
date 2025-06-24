"use client";

import { useState, useEffect, useCallback } from "react";
import { useIndexedDB } from "@/hooks/useIndexedDB";
import { useDatasetImport } from "@/hooks/useDatasetImport";
import { Dataset } from "@/types";
import { useDatasetSelection } from "@/contexts/DatasetContext";
import CardGrid from "@/components/CardGrid";
import { DatasetCard } from "@/components/home";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import DatasetsHeader from "./DatasetsHeader";
import toast from "react-hot-toast";

export default function SavedDatasets() {
  const { isInitialized, getAllDatasets, deleteDataset } = useIndexedDB();
  const { selectedDatasets, clearSelection } = useDatasetSelection();
  const { importDataset } = useDatasetImport();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshDatasets = useCallback(async () => {
    try {
      const savedDatasets = await getAllDatasets();
      setDatasets(
        savedDatasets.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      console.error("Failed to load datasets:", error);
    }
  }, [getAllDatasets]);

  useEffect(() => {
    const loadDatasets = async () => {
      if (!isInitialized) return;

      try {
        await refreshDatasets();
      } catch (error) {
        console.error("Failed to load datasets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDatasets();
  }, [isInitialized, refreshDatasets]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteDataset(id);
      setDatasets((prev) => prev.filter((dataset) => dataset.id !== id));
      toast.success(`Dataset "${name}" deleted successfully`);
    } catch (error) {
      console.error("Failed to delete dataset:", error);
      toast.error("Failed to delete dataset. Please try again.");
    }
  };

  const handleExport = (dataset: Dataset) => {
    const dataStr = JSON.stringify(dataset, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${dataset.name
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    importDataset(refreshDatasets);
  };
  if (!isInitialized || isLoading) {
    return <LoadingState />;
  }

  if (datasets.length === 0) {
    return <EmptyState onImport={handleImport} />;
  }
  return (
    <div className="space-y-6">
      <DatasetsHeader
        selectedCount={selectedDatasets.length}
        onImport={handleImport}
        onClearSelection={clearSelection}
      />

      <CardGrid
        items={datasets}
        renderCard={(dataset) => (
          <DatasetCard
            key={dataset.id}
            dataset={dataset}
            onDelete={handleDelete}
            onExport={handleExport}
          />
        )}
        gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      />
    </div>
  );
}
