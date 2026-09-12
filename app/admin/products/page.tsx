"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Eye, EyeOff, Edit2, Trash2, Loader } from "lucide-react";

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "parked" | "published">("all");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [displaySettings, setDisplaySettings] = useState<{
    collectionProductIds: string[];
    bestSellerProductIds: string[];
  }>({ collectionProductIds: [], bestSellerProductIds: [] });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("smartcap_display_settings");
        if (raw) {
          const parsed = JSON.parse(raw);
          setDisplaySettings({
            collectionProductIds: Array.isArray(parsed.collectionProductIds) ? parsed.collectionProductIds : [],
            bestSellerProductIds: Array.isArray(parsed.bestSellerProductIds) ? parsed.bestSellerProductIds : [],
          });
        }
      } catch (e) {}
    }

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMobileFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDisplaySection = (productId: string, section: "collectionProductIds" | "bestSellerProductIds") => {
    setDeleteError(null);
    setDisplaySettings((prev) => {
      const currentList = prev[section];
      const exists = currentList.includes(productId);

      if (!exists && section === "collectionProductIds" && currentList.length >= 7) {
        setDeleteError("Collection slots are full (Max 7 products). Remove or disable a product first.");
        return prev;
      }

      const newList = exists
        ? currentList.filter((id) => id !== productId)
        : [...currentList, productId];

      const updated = { ...prev, [section]: newList };
      if (typeof window !== "undefined") {
        localStorage.setItem("smartcap_display_settings", JSON.stringify(updated));
        window.dispatchEvent(new Event("smartcap_display_updated"));
      }
      return updated;
    });
  };

  const filteredProducts =
    statusFilter === "all" ? products : products.filter((p) => p.status === statusFilter);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoadingProducts(true);
    setDeleteError(null);
    try {
      const r = await fetch("/api/products");
      const d = await r.json();
      if (d.success) setProducts(d.data);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function toggleStatus(product: any) {
    const newStatus = product.status === "published" ? "parked" : "published";
    setTogglingId(product.id);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, status: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p)));
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function executeDelete(id: string) {
    setDeleteError(null);
    // Save previous state in case deletion fails
    const previousProducts = [...products];
    // Optimistically remove from state instantly
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    setDeletingId(id);

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || (!data.success && !data.data)) {
        // Rollback state if server deletion failed
        setProducts(previousProducts);
        setDeleteError(data.error || "Failed to delete product from database.");
      }
    } catch (err: any) {
      // Rollback state on network failure
      setProducts(previousProducts);
      setDeleteError(`Error deleting product: ${err.message || "Failed to reach server"}`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Block */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#1F2022]">Product Directory</h1>
        <p className="max-w-3xl text-xs md:text-sm leading-relaxed text-[#1F2022]/80">
          Products marked as <span className="font-bold text-[#1F2022]">Parked</span> are hidden from the public storefront. Publication control is in your hands.
        </p>
      </div>

      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs font-bold flex items-center justify-between rounded-none">
          <span>{deleteError}</span>
          <button onClick={() => setDeleteError(null)} className="text-red-700 hover:text-red-900 underline ml-4 cursor-pointer">
            Close
          </button>
        </div>
      )}

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-none border border-transparent md:border-[#E5E2DC] bg-[#D8D4CD]/40 md:bg-[#FFFFFF] shadow-none md:shadow-xs p-5 md:p-0">
        <div className="space-y-5 md:space-y-6 md:p-8">
          {/* Header Actions & Mobile Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex justify-between items-start w-full md:w-auto">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1F2022]">Catalog Items</h2>
                <p className="mt-1 text-[11px] md:text-sm text-[#1F2022]/90 md:text-[#94908C]">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              {/* Vertical Dots Icon (Mobile) with Dropdown */}
              <div className="md:hidden relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className="flex h-7 w-7 items-center justify-center bg-transparent border-none outline-none cursor-pointer text-[#1F2022]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>

                {/* Dropdown Menu (Mobile Only) */}
                {showMobileFilter && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-none border border-[#E5E2DC] bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col py-2">
                      <span className="px-4 py-2 text-xs font-bold text-[#94908C] uppercase tracking-wider">Filter Status</span>
                      {(["all", "parked", "published"] as const).map((f) => {
                        const count = f === "all" ? products.length : products.filter((p) => p.status === f).length;
                        const active = statusFilter === f;
                        return (
                          <button
                            key={f}
                            onClick={() => {
                              setStatusFilter(f);
                              setShowMobileFilter(false);
                            }}
                            className={`flex justify-between items-center px-4 py-2 text-xs font-bold text-left transition cursor-pointer capitalize ${
                              active
                                ? "bg-[#1F2022] text-[#FCFAF7]"
                                : "text-[#1F2022] hover:bg-[#FCFAF7]"
                            }`}
                          >
                            <span>{f === "all" ? "All" : f}</span>
                            <span className={active ? "text-white" : "text-[#94908C]"}>({count})</span>
                          </button>
                        );
                      })}
                      <div className="border-t border-[#E5E2DC] mt-1 pt-1">
                        <button
                          onClick={() => {
                            loadProducts();
                            setShowMobileFilter(false);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-xs font-bold text-[#1F2022] hover:bg-[#FCFAF7] cursor-pointer"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${loadingProducts ? "animate-spin" : ""}`} />
                          Refresh List
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadProducts}
              disabled={mounted ? Boolean(loadingProducts) : false}
              className="hidden md:flex gap-2 rounded-none border-[#E5E2DC] text-[#1F2022] hover:bg-[#FCFAF7] cursor-pointer text-xs font-bold"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingProducts ? "animate-spin" : ""}`} />
              Refresh List
            </Button>
          </div>

          {/* Status filter tabs (Desktop Only) */}
          <div className="hidden md:flex gap-2">
            {(["all", "parked", "published"] as const).map((f) => {
              const count = f === "all" ? products.length : products.filter((p) => p.status === f).length;
              const active = statusFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`rounded-none px-4 py-1.5 text-xs font-bold transition cursor-pointer capitalize ${
                    active
                      ? "bg-[#1F2022] text-[#FCFAF7]"
                      : "border border-[#E5E2DC] text-[#94908C] hover:border-[#1F2022] hover:text-[#1F2022]"
                  }`}
                >
                  {f === "all" ? "All" : f} ({count})
                </button>
              );
            })}
          </div>

          {/* Table / Empty State */}
          {loadingProducts ? (
            <p className="py-8 text-center text-sm font-semibold text-[#94908C]">Loading product directory...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#94908C]">
              {products.length === 0
                ? "No products saved yet. Upload product photos in Bulk Massal to get started."
                : "No products found with this status."}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-none border-none md:border md:border-[#E5E2DC] bg-white p-4 md:p-0">
              <Table className="min-w-full table-auto">
                <TableHeader>
                  <TableRow className="bg-transparent md:bg-[#FCFAF7] border-b-0 md:border-b">
                    <TableHead className="pl-0 md:pl-4 font-bold text-[#1F2022] text-[11px] md:text-sm">Photo</TableHead>
                    <TableHead className="font-bold text-[#1F2022] text-[11px] md:text-sm">Name & Slug</TableHead>
                    <TableHead className="font-bold text-[#1F2022] text-[11px] md:text-sm">Price</TableHead>
                    <TableHead className="font-bold text-[#1F2022] text-[11px] md:text-sm">Status</TableHead>
                    <TableHead className="font-bold text-[#1F2022] text-[11px] md:text-sm">Homepage Display</TableHead>
                    <TableHead className="pr-0 md:pr-4 text-right font-bold text-[#1F2022] text-[11px] md:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((p) => (
                    <TableRow key={p.id} className="border-b-0 md:border-b hover:bg-[#FCFAF7]">
                      <TableCell className="pl-0 md:pl-4 py-2 md:py-4">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="h-10 w-10 md:h-12 md:w-12 rounded-none border border-transparent md:border-[#E5E2DC] object-cover bg-gray-100"
                          />
                        ) : (
                          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-none border border-[#E5E2DC] bg-[#898989] text-xs text-white font-bold">
                            No Img
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-2 md:py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1F2022] text-[10px] md:text-sm truncate max-w-[140px] sm:max-w-xs">{p.name}</span>
                          {p.slug && <span className="text-[9px] md:text-xs text-[#94908C] font-mono">{p.slug}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="font-extrabold text-[#1F2022] text-[10px] md:text-sm py-2 md:py-4">{formatRupiah(p.price)}</TableCell>
                      <TableCell className="py-2 md:py-4">
                        <Badge
                          className={
                            p.status === "published"
                              ? "rounded-none bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-bold border border-emerald-300 text-[9px] md:text-xs px-1 md:px-2.5 py-0 md:py-0.5"
                              : "rounded-none bg-amber-100 text-amber-800 hover:bg-amber-100 font-bold border border-amber-300 text-[9px] md:text-xs px-1 md:px-2.5 py-0 md:py-0.5"
                          }
                        >
                          {p.status === "published" ? "Published" : "Parked"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 md:py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(() => {
                            const isSelectedCol = displaySettings.collectionProductIds.includes(p.id);
                            const isColFull = displaySettings.collectionProductIds.length >= 7;
                            return (
                              <button
                                type="button"
                                onClick={() => toggleDisplaySection(p.id, "collectionProductIds")}
                                className={`rounded-none px-2 py-1 text-[9px] md:text-[10px] font-extrabold cursor-pointer border transition-colors ${
                                  isSelectedCol
                                    ? "bg-[#353B2D] text-[#FCFAF7] border-[#353B2D]"
                                    : isColFull
                                    ? "bg-[#F5F2ED] text-[#94908C] border-[#E5E2DC] hover:border-red-400 hover:text-red-600"
                                    : "bg-white text-[#94908C] border-[#E5E2DC] hover:border-[#1F2022] hover:text-[#1F2022]"
                                }`}
                                title={
                                  isSelectedCol
                                    ? "Click to remove from Collection"
                                    : isColFull
                                    ? "Collection slot full (Max 7 products)"
                                    : "Add to Collection"
                                }
                              >
                                {isSelectedCol ? "✓ Collection" : isColFull ? "- Collection" : "+ Collection"}
                              </button>
                            );
                          })()}

                          <button
                            type="button"
                            onClick={() => toggleDisplaySection(p.id, "bestSellerProductIds")}
                            className={`rounded-none px-2 py-1 text-[9px] md:text-[10px] font-extrabold cursor-pointer border transition-colors ${
                              displaySettings.bestSellerProductIds.includes(p.id)
                                ? "bg-[#C4A265] text-[#1B1C1E] border-[#C4A265]"
                                : "bg-white text-[#94908C] border-[#E5E2DC] hover:border-[#1F2022] hover:text-[#1F2022]"
                            }`}
                            title="Toggle display in Best Selling Section"
                          >
                            {displaySettings.bestSellerProductIds.includes(p.id) ? "★ Best Seller" : "+ Best Seller"}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="pr-0 md:pr-4 text-right py-2 md:py-4">
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <Button
                            size="sm"
                            variant={p.status === "published" ? "outline" : "default"}
                            disabled={Boolean(togglingId === p.id || deletingId === p.id)}
                            onClick={() => toggleStatus(p)}
                            className={`rounded-none px-1.5 md:px-3 h-7 md:h-9 text-[9px] md:text-xs font-bold cursor-pointer gap-1 md:gap-1.5 ${
                              p.status === "published"
                                ? "border-[#E5E2DC] text-[#1F2022] hover:bg-[#FCFAF7]"
                                : "bg-[#1F2022] text-[#FCFAF7] hover:bg-[#1F2022]/90"
                            }`}
                          >
                            {togglingId === p.id ? (
                              <Loader className="h-3 w-3 md:h-3.5 md:w-3.5 animate-spin" />
                            ) : p.status === "published" ? (
                              <EyeOff className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            ) : (
                              <Eye className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            )}
                            <span className="hidden md:inline">{p.status === "published" ? "Unpublish" : "Publish"}</span>
                            <span className="md:hidden">Toggle</span>
                          </Button>

                          <Link href={`/admin/products/${p.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-none px-2 h-7 md:h-9 text-[9px] md:text-xs border-[#E5E2DC] text-[#1F2022] hover:bg-[#FCFAF7] cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            </Button>
                          </Link>

                          <Button
                            size="sm"
                            variant="outline"
                            disabled={Boolean(togglingId === p.id || deletingId === p.id)}
                            onClick={() => setProductToDelete({ id: p.id, name: p.name })}
                            className="rounded-none px-2 h-7 md:h-9 text-[9px] md:text-xs border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                            title="Delete Product"
                          >
                            {deletingId === p.id ? (
                              <Loader className="h-3 w-3 md:h-3.5 md:w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Custom React Delete Confirmation Modal (Independent of Browser Pop-up Blockers) */}
      {productToDelete && (
        <div
          onClick={() => setProductToDelete(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 cursor-pointer animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-none border border-[#E5E2DC] bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
          >
            <div className="space-y-2">
              <h3 className="font-extrabold text-base text-[#1F2022]">Delete Product From Catalog?</h3>
              <p className="text-xs text-[#94908C] leading-relaxed">
                Are you sure you want to permanently delete <span className="font-bold text-[#1F2022]">"{productToDelete.name}"</span> from the database? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E2DC]">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="rounded-none border border-[#E5E2DC] bg-white px-4 py-2 text-xs font-bold text-[#1F2022] hover:bg-[#FCFAF7] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = productToDelete.id;
                  setProductToDelete(null);
                  executeDelete(targetId);
                }}
                className="rounded-none bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer shadow-xs transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
