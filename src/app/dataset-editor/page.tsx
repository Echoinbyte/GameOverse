import Header from "@/components/Header";
import { DatasetForm } from "@/components/dataset-editor";

interface DatasetEditorProps {
  searchParams: { id?: string };
}

export default function DatasetEditor({ searchParams }: DatasetEditorProps) {
  const isEditing = !!searchParams.id;

  return (
    <>
      <Header
        title={isEditing ? "Edit Dataset" : "Create New Dataset"}
        description={
          isEditing
            ? "Modify your existing learning dataset"
            : "Create a new dataset of games that can be used across all learning tools"
        }
      />

      {/* Form Section */}
      <div className="max-w-4xl mx-auto">
        <DatasetForm datasetId={searchParams.id} />
      </div>
    </>
  );
}
