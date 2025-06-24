import { useIndexedDB } from "@/hooks/useIndexedDB";
import { Dataset } from "@/types";
import toast from "react-hot-toast";

export const useDatasetImport = () => {
  const { saveDataset } = useIndexedDB();

  const importDataset = (onSuccess?: () => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const importedDataset = JSON.parse(text) as Dataset;

        // Validate the imported dataset structure
        const isValidDataset =
          importedDataset.name &&
          importedDataset.pairs &&
          Array.isArray(importedDataset.pairs);

        if (!isValidDataset) {
          toast.error("Invalid dataset file format");
          return;
        }

        await saveDataset(importedDataset.name, importedDataset.pairs);
        toast.success(
          `Dataset "${importedDataset.name}" imported successfully!`
        );

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error("Failed to import dataset:", error);
        toast.error("Failed to import dataset. Please check the file format.");
      }
    };
    input.click();
  };

  return { importDataset };
};
