"use client";

import { useState, useTransition } from "react";
import { deleteProduct, toggleProductStatus } from "./actions";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ToggleStatusButton({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleProductStatus(id, currentStatus);
    });
  };

  const isPublished = currentStatus === "published";

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 rounded-none shadow-xs border-[#1F2022] bg-[#FCFAF7] text-[#1F2022] hover:bg-[#D8D4CD] disabled:opacity-50"
      onClick={handleToggle}
      disabled={isPending}
      title={isPublished ? "Hide from Catalog" : "Publish to Catalog"}
    >
      {isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
      <span className="hidden sm:inline-block font-semibold">
        {isPublished ? "Published" : "Parked"}
      </span>
    </Button>
  );
}

export function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProduct(id);
      setShowConfirmModal(false);
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 rounded-none border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
        onClick={() => setShowConfirmModal(true)}
        disabled={isPending}
        title="Delete Product"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {showConfirmModal && (
        <div
          onClick={() => setShowConfirmModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-none border border-[#E5E2DC] bg-white p-6 shadow-2xl space-y-5"
          >
            <div className="space-y-2">
              <h3 className="font-extrabold text-base text-[#1F2022]">Delete Product?</h3>
              <p className="text-xs text-[#94908C]">
                Are you sure you want to permanently delete this product from the database?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E2DC]">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-none border border-[#E5E2DC] bg-white px-4 py-2 text-xs font-bold text-[#1F2022] hover:bg-[#FCFAF7] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-none bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer shadow-xs"
              >
                {isPending ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

