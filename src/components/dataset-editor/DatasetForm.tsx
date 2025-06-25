"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GamePair, Dataset } from "@/types";
import { useIndexedDB } from "@/hooks/useIndexedDB";
import { useDatasetImport } from "@/hooks/useDatasetImport";
import ImportSection from "./ImportSection";
import DatasetNameInput from "./DatasetNameInput";
import GamePairsEditor from "./GamePairsEditor";
import LoadingStates from "./LoadingStates";
import SubmitButton from "./SubmitButton";
import toast from "react-hot-toast";

interface DatasetFormProps {
  datasetId?: string;
}

// Generate a unique ID with multiple entropy sources
const generateUniqueId = (() => {
  let counter = 0;
  return () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const currentCounter = ++counter;
    return `pair-${timestamp}-${currentCounter}-${random}`;
  };
})();

export default function DatasetForm({ datasetId }: DatasetFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const {
    isInitialized,
    isLoading,
    error,
    saveDataset,
    getDataset,
    updateDataset,
  } = useIndexedDB();
  const { importDataset } = useDatasetImport();

  const [pairs, setPairs] = useState<GamePair[]>([
    { id: generateUniqueId(), term: "", definition: "" },
  ]);
  const [datasetName, setDatasetName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDataset, setIsLoadingDataset] = useState(false);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const hasShownError = useRef(false);
  const loadedDatasetId = useRef<string | null>(null);

  const isEditing = !!datasetId;

  // Load existing dataset if editing
  useEffect(() => {
    const loadDataset = async () => {
      // Early return conditions
      if (!isEditing || !datasetId || !isInitialized) return;

      // Prevent duplicate loads for the same dataset ID
      if (loadedDatasetId.current === datasetId) return;

      // Prevent duplicate loads while loading
      if (isLoadingDataset) return;

      setIsLoadingDataset(true);
      hasShownError.current = false;
      loadedDatasetId.current = datasetId;

      try {
        const dataset = await getDataset(datasetId);
        if (dataset) {
          setCurrentDataset(dataset);
          setDatasetName(dataset.name);
          // Ensure each pair has a unique ID for the form
          const pairsWithIds = dataset.pairs.map((pair) => ({
            ...pair,
            id: pair.id || generateUniqueId(),
          }));
          setPairs(pairsWithIds);
        } else {
          if (!hasShownError.current) {
            toast.error("Dataset not found");
            hasShownError.current = true;
          }
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to load dataset:", error);
        if (!hasShownError.current) {
          toast.error("Failed to load dataset");
          hasShownError.current = true;
        }
        router.push("/");
      } finally {
        setIsLoadingDataset(false);
      }
    };

    loadDataset();
  }, [
    isEditing,
    datasetId,
    isInitialized,
    getDataset,
    router,
    isLoadingDataset,
  ]);
  // Show loading state while loading dataset
  if (isLoadingDataset) {
    return (
      <LoadingStates
        isLoadingDataset={isLoadingDataset}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  if (isLoading) {
    return (
      <LoadingStates
        isLoadingDataset={isLoadingDataset}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  if (error) {
    return (
      <LoadingStates
        isLoadingDataset={isLoadingDataset}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  const addPair = () => {
    const newPair: GamePair = {
      id: generateUniqueId(),
      term: "",
      definition: "",
    };

    setPairs((prev) => [...prev, newPair]);
  };

  const removePair = (id: string) => {
    if (pairs.length > 1) {
      setPairs((prev) => prev.filter((pair) => pair.id !== id));
    }
  };

  const updatePair = (
    id: string,
    field: "term" | "definition",
    value: string
  ) => {
    setPairs((prev) =>
      prev.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isInitialized) {
      toast.error("Database not ready. Please wait and try again.");
      return;
    }

    if (!datasetName || datasetName.trim().length === 0) {
      toast.error("Dataset name is required");
      return;
    }

    // Validate that all pairs have both term and definition
    const validPairs = pairs.filter(
      (pair) => pair.term.trim().length > 0 && pair.definition.trim().length > 0
    );

    if (validPairs.length === 0) {
      toast.error("At least one complete pair is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && currentDataset) {
        // Update existing dataset
        const updates = {
          name: datasetName,
          pairs: validPairs,
          updatedAt: new Date(),
        };
        await updateDataset(currentDataset.id, updates);
        toast.success(`Dataset "${datasetName}" updated successfully!`);
      } else {
        // Create new dataset
        await saveDataset(datasetName, validPairs);
        toast.success(`Dataset "${datasetName}" created successfully!`);
      }

      // Redirect to home
      router.push("/");
    } catch (error) {
      console.error("Failed to save dataset:", error);
      toast.error(
        `Failed to ${isEditing ? "update" : "save"} dataset. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImport = () => {
    importDataset(() => {
      // On successful import, we could optionally redirect or show imported data
      toast.success("Dataset imported! You can find it on the home page.");
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      <ImportSection onImport={handleImport} />

      <DatasetNameInput value={datasetName} onChange={setDatasetName} />

      <GamePairsEditor
        pairs={pairs}
        onUpdatePair={updatePair}
        onRemovePair={removePair}
        onAddPair={addPair}
      />

      <SubmitButton isSubmitting={isSubmitting} isEditing={isEditing} />
    </form>
  );
}
