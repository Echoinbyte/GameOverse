import { useState, useEffect } from "react";
import { GamePair, Dataset } from "@/types";
import {
  initDB,
  saveDataset as saveDatasetToDB,
  getAllDatasets as getAllDatasetsFromDB,
  getDataset as getDatasetFromDB,
  updateDataset as updateDatasetInDB,
  deleteDataset as deleteDatasetFromDB,
} from "@/lib/indexedDB";

export const useIndexedDB = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error("Failed to initialize IndexedDB:", err);
        setError("Failed to initialize local storage");
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const saveDataset = async (
    name: string,
    pairs: GamePair[]
  ): Promise<Dataset> => {
    if (!isInitialized) {
      throw new Error("Database not initialized");
    }
    return await saveDatasetToDB(name, pairs);
  };

  const getAllDatasets = async (): Promise<Dataset[]> => {
    if (!isInitialized) {
      throw new Error("Database not initialized");
    }
    return await getAllDatasetsFromDB();
  };

  const getDataset = async (id: string): Promise<Dataset | null> => {
    if (!isInitialized) {
      throw new Error("Database not initialized");
    }
    return await getDatasetFromDB(id);
  };

  const updateDataset = async (
    id: string,
    updates: Partial<Omit<Dataset, "id" | "createdAt">>
  ): Promise<Dataset> => {
    if (!isInitialized) {
      throw new Error("Database not initialized");
    }
    return await updateDatasetInDB(id, updates);
  };

  const deleteDataset = async (id: string): Promise<void> => {
    if (!isInitialized) {
      throw new Error("Database not initialized");
    }
    return await deleteDatasetFromDB(id);
  };

  return {
    isInitialized,
    isLoading,
    error,
    saveDataset,
    getAllDatasets,
    getDataset,
    updateDataset,
    deleteDataset,
  };
};
