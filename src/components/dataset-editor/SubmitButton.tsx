"use client";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isEditing: boolean;
}

export default function SubmitButton({
  isSubmitting,
  isEditing,
}: SubmitButtonProps) {
  return (
    <div className="flex justify-center pt-8">
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-12 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {isEditing ? "Updating Dataset..." : "Saving Dataset..."}
          </div>
        ) : isEditing ? (
          "Update Dataset"
        ) : (
          "Save Dataset"
        )}
      </button>
    </div>
  );
}
