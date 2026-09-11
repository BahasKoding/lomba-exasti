"use client";

import { useTransition } from "react";
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

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        await deleteProduct(id);
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 rounded-none border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete Product"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
