"use client";

interface LoadingStatesProps {
  isLoadingDataset?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

export default function LoadingStates({
  isLoadingDataset,
  isLoading,
  error,
}: LoadingStatesProps) {
  if (isLoadingDataset) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading dataset...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Initializing storage...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-400 text-lg">
          {error}. Please refresh the page.
        </div>
      </div>
    );
  }

  return null;
}
