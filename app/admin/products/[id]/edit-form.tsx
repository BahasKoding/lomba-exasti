"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Image as ImageIcon, AlertCircle } from "lucide-react";

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
        setError(result.error || "An error occurred while saving.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E5E2DC] p-6 md:p-8 space-y-8 rounded-none shadow-2xs">
      {error && (
        <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 text-xs font-bold border border-red-200 rounded-none">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section 1: General Information */}
      <div className="space-y-4">
        <div className="border-b border-[#E5E2DC] pb-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#94908C]">General Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-bold text-[#1F2022]">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="rounded-none border-[#E5E2DC] bg-[#FCFAF7] focus:bg-white focus:border-[#1F2022] text-[#1F2022] text-xs md:text-sm h-10 px-3 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-xs font-bold text-[#1F2022]">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="rounded-none border-[#E5E2DC] bg-[#FCFAF7] focus:bg-white focus:border-[#1F2022] text-[#1F2022] text-xs md:text-sm font-mono h-10 px-3 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs font-bold text-[#1F2022]">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Baseball Cap"
              className="rounded-none border-[#E5E2DC] bg-[#FCFAF7] focus:bg-white focus:border-[#1F2022] text-[#1F2022] text-xs md:text-sm h-10 px-3 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="material" className="text-xs font-bold text-[#1F2022]">Material</Label>
            <Input
              id="material"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="e.g. Corduroy"
              className="rounded-none border-[#E5E2DC] bg-[#FCFAF7] focus:bg-white focus:border-[#1F2022] text-[#1F2022] text-xs md:text-sm h-10 px-3 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Pricing & Inventory */}
      <div className="space-y-4">
        <div className="border-b border-[#E5E2DC] pb-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#94908C]">Pricing & Stock</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="price" className="text-xs font-bold text-[#1F2022]">Price (Rp)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              min={0}
              className="rounded-none border-[#E5E2DC] bg-[#FCFAF7] focus:bg-white focus:border-[#1F2022] text-[#1F2022] text-xs md:text-sm font-semibold h-10 px-3 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stockCount" className="text-xs font-bold text-[#1F2022]">Stock Count</Label>
            <Input
              id="stockCount"
              name="stockCount"
              type="number"
              value={formData.stockCount}
              onChange={handleChange}
              required
              min={0}
              className="rounded-none border-[#E5E2DC] bg-[#FCFAF7] focus:bg-white focus:border-[#1F2022] text-[#1F2022] text-xs md:text-sm font-semibold h-10 px-3 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Media & AI Description */}
      <div className="space-y-4">
        <div className="border-b border-[#E5E2DC] pb-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#94908C]">Media & AI Content</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-xs font-bold text-[#1F2022]">Product Image</Label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Thumbnail Preview Box */}
              <div className="h-24 w-24 shrink-0 rounded-none border border-[#E5E2DC] bg-[#FCFAF7] flex items-center justify-center overflow-hidden">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#94908C]">
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-[10px] font-bold">No Image</span>
                  </div>
                )}
              </div>

              {/* URL Input */}
              <div className="w-full space-y-1">
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Paste Image URL or Base64 String"
                  className="rounded-none border-[#E5E2DC] bg-[#FCFAF7] focus:bg-white focus:border-[#1F2022] text-[#1F2022] text-xs font-mono h-10 px-3 transition-colors truncate"
                />
                <p className="text-[11px] text-[#94908C]">
                  Base64 data or standard HTTPS image link accepted.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="aiDescription" className="text-xs font-bold text-[#1F2022]">AI Description</Label>
            <textarea
              id="aiDescription"
              name="aiDescription"
              value={formData.aiDescription}
              onChange={handleChange}
              rows={4}
              placeholder="Commercial product description generated by AI..."
              className="w-full rounded-none border border-[#E5E2DC] bg-[#FCFAF7] focus:bg-white focus:border-[#1F2022] p-3 text-xs md:text-sm text-[#1F2022] leading-relaxed transition-colors outline-none resize-y"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E2DC]">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          disabled={isPending}
          className="rounded-none border-[#E5E2DC] bg-white text-[#1F2022] hover:bg-[#FCFAF7] text-xs font-bold h-10 px-6 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-none bg-[#1F2022] text-[#FCFAF7] hover:bg-[#1F2022]/90 text-xs font-bold h-10 px-8 cursor-pointer shadow-2xs"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader className="h-3.5 w-3.5 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
