import Header from "@/components/Header";
import { DatasetForm } from "@/components/dataset-editor";

interface Params {
  id?: string;
}

export default async function DatasetEditor({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const { id = undefined } = await searchParams;
  const isEditing = !!id;

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
        <DatasetForm datasetId={id} />
      </div>
    </>
  );
}
