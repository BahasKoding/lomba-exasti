"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: product.name || "",
    slug: product.slug || "",
    price: product.price || 0,
    stockCount: product.stockCount || 0,
    category: product.category || "",
    material: product.material || "",
    aiDescription: product.aiDescription || "",
    imageUrl: product.imageUrl || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stockCount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateProduct(product.id, formData);
      if (result.success) {
        router.push("/admin/products");
      } else {
        setError(result.error || "An error occurred");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-[#FCFAF7] p-6 border border-[#1F2022] shadow-xs">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 text-sm font-bold border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-extrabold text-[#1F2022]">Product Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="rounded-none border-[#1F2022]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug" className="font-extrabold text-[#1F2022]">Slug</Label>
          <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required className="rounded-none border-[#1F2022]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="font-extrabold text-[#1F2022]">Price (Rp)</Label>
          <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required className="rounded-none border-[#1F2022]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockCount" className="font-extrabold text-[#1F2022]">Stock Count</Label>
          <Input id="stockCount" name="stockCount" type="number" value={formData.stockCount} onChange={handleChange} required className="rounded-none border-[#1F2022]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="font-extrabold text-[#1F2022]">Category</Label>
          <Input id="category" name="category" value={formData.category} onChange={handleChange} className="rounded-none border-[#1F2022]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="material" className="font-extrabold text-[#1F2022]">Material</Label>
          <Input id="material" name="material" value={formData.material} onChange={handleChange} className="rounded-none border-[#1F2022]" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="font-extrabold text-[#1F2022]">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="rounded-none border-[#1F2022]" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="aiDescription" className="font-extrabold text-[#1F2022]">AI Description</Label>
        <textarea
          id="aiDescription"
          name="aiDescription"
          value={formData.aiDescription}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-none border border-[#1F2022] bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-[#1F2022]/10">
        <Button
          type="button"
          variant="outline"
          className="rounded-none border-[#1F2022]"
          onClick={() => router.push("/admin/products")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="rounded-none bg-[#1F2022] text-[#FCFAF7] hover:bg-[#1F2022]/80"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
