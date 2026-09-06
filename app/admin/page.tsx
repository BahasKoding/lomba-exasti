"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UploadCloud, AlertCircle, Loader, X, Info, RefreshCw, Trash2, Eye, EyeOff } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

async function fileToItem(file: File) {
  const imageBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return { name: file.name.replace(/\.[^.]+$/, ""), imageBase64, mimeType: file.type };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [modalFiles, setModalFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  // --- Product Directory State & Handlers ---
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "parked" | "published">("all");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const filteredProducts =
    statusFilter === "all" ? products : products.filter((p) => p.status === statusFilter);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.success ? d.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  async function loadProducts() {
    setLoadingProducts(true);
    try {
      const r = await fetch("/api/products");
      const d = await r.json();
      if (d.success) setProducts(d.data);
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

  async function deleteProduct(id: string) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch {
      alert("Error deleting product.");
    } finally {
      setDeletingId(null);
    }
  }

  // --- Image Preview Object URLs ---
  const previewUrls = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  const modalPreviewUrls = useMemo(() => {
    return modalFiles.map((file) => URL.createObjectURL(file));
  }, [modalFiles]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const isImageFile = (file: File) => {
    if (file.type && file.type.startsWith("image/")) return true;
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "avif"].includes(ext);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const incomingFiles = Array.from(e.target.files);
      const validImages = incomingFiles.filter(isImageFile);
      const invalidFiles = incomingFiles.filter((f) => !isImageFile(f));

      if (invalidFiles.length > 0) {
        setError(`File "${invalidFiles[0].name}" is not a valid image. Only image files (PNG, JPG, WEBP) are allowed.`);
      } else {
        setError(null);
      }

      if (validImages.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validImages]);
      }
    }
  };

  const openModal = () => {
    setModalFiles([...selectedFiles]);
    setIsModalOpen(true);
  };

  const handleRemoveFromModal = (indexToRemove: number) => {
    setModalFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveDirect = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveModal = () => {
    setSelectedFiles([...modalFiles]);
    setIsModalOpen(false);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedFiles.length) {
      setError("Please select at least one image file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setProgressMessage(`Uploading & converting ${selectedFiles.length} photo(s)...`);

      const items = await Promise.all(selectedFiles.map(fileToItem));

      setProgressMessage("Gemini AI is analyzing product photos... (±10s per photo)");

      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process images with AI.");
      }

      sessionStorage.setItem("drafts", JSON.stringify({ items, results: data.results, createdAt: new Date().toISOString() }));
      router.push("/admin/review");
    } catch (err: any) {
      setError(err.message || "An error occurred while uploading files.");
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 1. Page Title Header Block */}
      <div className="relative rounded-none border border-transparent md:border-none bg-[#D8D4CD]/40 md:bg-transparent p-5 md:p-0 shadow-none space-y-2 md:space-y-2">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#1F2022]">Bulk Massal</h1>
          
          {/* Info Icon (Mobile Only) */}
          <div className="md:hidden">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowInfoPopup((prev) => !prev)}
                className="flex h-7 w-7 items-center justify-center rounded-none border border-[#1F2022]/40 bg-transparent text-[#1F2022] transition-all duration-200 cursor-pointer"
                title="Workflow Information"
              >
                <span className="font-serif text-sm font-bold italic">i</span>
              </button>

              {/* Floating Pop-up (Mobile) */}
              {showInfoPopup && (
                <div className="absolute right-0 top-full pt-2 z-50 w-72 animate-in fade-in zoom-in-95 duration-200">
                  <div className="rounded-none border border-[#E5E2DC] bg-white p-5 shadow-xl">
                    <div className="space-y-3">
                      <div className="text-center">
                        <h3 className="text-sm font-extrabold text-[#1F2022]">How It Works</h3>
                        <p className="mt-1 text-[10px] text-[#94908C]">
                          Streamline your catalog management with our intelligent bulk processing workflow designed for effortless curation.
                        </p>
                      </div>
                      <div className="space-y-2.5 pt-2 text-[10px] text-[#1F2022]">
                        <div>
                          <p className="font-extrabold text-[#1F2022]">1. Upload Your Collection</p>
                          <p className="mt-0.5 text-[#94908C]">Select and upload multiple product images of your caps simultaneously into the studio workspace.</p>
                        </div>
                        <div>
                          <p className="font-extrabold text-[#1F2022]">2. Intelligent Visual Analysis</p>
                          <p className="mt-0.5 text-[#94908C]">Our advanced AI vision engine automatically inspects each piece detecting the category, material texture, and structural details to draft compelling commercial descriptions.</p>
                        </div>
                        <div>
                          <p className="font-extrabold text-[#1F2022]">3. Review & Publish</p>
                          <p className="mt-0.5 text-[#94908C]">Examine the generated results in the AI Review suite to ensure absolute perfection before publishing them instantly to your storefront catalog.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="max-w-3xl text-[11px] md:text-sm leading-relaxed text-[#1F2022]/90 md:text-[#1F2022]/80">
          Seamlessly upload your entire collection in a single batch. Intelligent AI vision instantly analyzes each piece's
          fabric and aesthetic, effortlessly crafting bespoke commercial descriptions for your catalog.
        </p>
      </div>

      {/* 2. Main Container Wireframe Card */}
      <div className="relative overflow-visible rounded-none border border-transparent md:border-[#E5E2DC] bg-[#D8D4CD]/40 md:bg-[#D8D4CD]/30 p-5 md:p-10 shadow-none md:shadow-xs">
        {/* Info Icon (Desktop Only) */}
        <div className="hidden md:block absolute right-6 top-6 z-20">
          <div
            className="relative"
            onMouseEnter={() => setShowInfoPopup(true)}
            onMouseLeave={() => setShowInfoPopup(false)}
          >
            <button
              type="button"
              onClick={() => setShowInfoPopup((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-none border border-[#1F2022]/30 bg-white text-[#1F2022] transition-all duration-200 hover:border-[#1F2022] hover:bg-[#1F2022] hover:text-[#FCFAF7] shadow-2xs cursor-pointer"
              title="Workflow Information"
            >
              <Info className="h-5 w-5" />
            </button>

            {/* Floating Pop-up: "How It Works" (Desktop) */}
            {showInfoPopup && (
              <div className="absolute right-0 top-full pt-2 z-50 w-96 animate-in fade-in zoom-in-95 duration-200">
                <div className="rounded-none border border-[#E5E2DC] bg-white p-6 shadow-xl">
                  <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-base font-extrabold text-[#1F2022]">How It Works</h3>
                    <p className="mt-1 text-xs text-[#94908C]">
                      Streamline your catalog management with our intelligent bulk processing workflow designed for effortless curation.
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-2 text-xs text-[#1F2022]">
                    <div>
                      <p className="font-extrabold text-[#1F2022]">1. Upload Your Collection</p>
                      <p className="mt-0.5 text-[#94908C]">
                        Select and upload multiple product images of your caps simultaneously into the studio workspace.
                      </p>
                    </div>

                    <div>
                      <p className="font-extrabold text-[#1F2022]">2. Intelligent Visual Analysis</p>
                      <p className="mt-0.5 text-[#94908C]">
                        Our advanced AI vision engine automatically inspects each piece detecting the category, material texture, and structural details to draft compelling commercial descriptions.
                      </p>
                    </div>

                    <div>
                      <p className="font-extrabold text-[#1F2022]">3. Review & Publish</p>
                      <p className="mt-0.5 text-[#94908C]">
                        Examine the generated results in the AI Review suite to ensure absolute perfection before publishing them instantly to your storefront catalog.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="mx-auto max-w-xl">
          <div className="relative group">
            <input
              id="bulk-image-input"
              type="file"
              multiple
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileChange}
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
            />
            <label
              htmlFor="bulk-image-input"
              className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-none border-2 border-dashed border-[#1F2022]/40 bg-white p-8 text-center transition-all duration-300 group-hover:border-[#1F2022] group-hover:bg-[#FCFAF7] shadow-2xs"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-none bg-[#FCFAF7] border border-[#E5E2DC] text-[#1F2022] transition-transform">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1F2022]">Drag & Drop Image</h3>
                  <p className="mt-1 text-xs text-[#94908C]">
                    Click to choose from your local <br /> JPG, PNG, WEBP max 10MB per File
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* File Preview Bar & Count */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#94908C]">
            {selectedFiles.length} File{selectedFiles.length !== 1 && "s"}
          </p>

          {/* Uploaded Thumbnails + "More" Box (Strictly 0 Corner Radius: rounded-none) */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl">
              {previewUrls.slice(0, 5).map((url, idx) => (
                <div
                  key={idx}
                  className="relative group h-16 w-16 overflow-hidden rounded-none border border-[#E5E2DC] bg-white shadow-2xs"
                >
                  <img src={url} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveDirect(idx)}
                    className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-none bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Remove image"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}

              {/* "More" Square Card (Strictly 0 Corner Radius: Appears ONLY when > 5 files) */}
              {selectedFiles.length > 5 && (
                <button
                  type="button"
                  onClick={openModal}
                  className="flex h-16 w-20 flex-col items-center justify-center rounded-none border border-[#1F2022] bg-white px-2 text-xs font-black text-[#1F2022] hover:bg-[#1F2022] hover:text-white transition-colors duration-200 shadow-2xs cursor-pointer"
                >
                  <span>More</span>
                  <span className="text-[10px] font-normal text-[#94908C]">({selectedFiles.length})</span>
                </button>
              )}
            </div>
          )}

          {/* Action Generate Button */}
          <div className="mt-2 w-full md:w-auto flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isUploading || selectedFiles.length === 0}
              size="lg"
              className="h-11 w-[80%] md:w-auto md:min-w-[200px] rounded-none bg-[#898989] px-8 text-sm font-bold text-white transition-all hover:bg-[#1F2022] disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Generate"
              )}
            </Button>
          </div>

          {/* Progress / Error Alerts (Strictly 0 Corner Radius: rounded-none) */}
          {isUploading && progressMessage && (
            <div className="mt-4 flex items-center gap-3 rounded-none border border-[#E5E2DC] bg-white p-3.5 text-xs font-semibold text-[#1F2022]">
              <Loader className="h-4 w-4 animate-spin text-[#1F2022]" />
              <span>{progressMessage}</span>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2.5 rounded-none border border-red-200 bg-red-50 p-3.5 text-xs font-bold text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Product Directory Table */}
      <div className="overflow-hidden rounded-none border border-transparent md:border-[#E5E2DC] bg-[#D8D4CD]/40 md:bg-[#FFFFFF] shadow-none md:shadow-xs p-5 md:p-0">
        <div className="space-y-5 md:space-y-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#1F2022]">Product Directory</h2>
                <p className="mt-1 text-[11px] md:text-sm text-[#1F2022]/90 md:text-[#94908C]">
                  Products marked as <span className="font-bold text-[#1F2022]">Parked</span> are hidden from the public storefront publication control is in your hands.
                </p>
              </div>
              
              {/* Vertical Dots Icon (Mobile) with Dropdown */}
              <div className="md:hidden relative" ref={dropdownRef}>
                <button 
                  type="button" 
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                  className="flex h-7 w-7 items-center justify-center bg-transparent border-none outline-none cursor-pointer"
                >
                  <svg className="w-5 h-5 text-[#1F2022]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              disabled={loadingProducts}
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
                  className={`rounded-none px-4 py-1.5 text-xs font-bold transition cursor-pointer capitalize ${active
                      ? "bg-[#1F2022] text-[#FCFAF7]"
                      : "border border-[#E5E2DC] text-[#94908C] hover:border-[#1F2022] hover:text-[#1F2022]"
                    }`}
                >
                  {f === "all" ? "All" : f} ({count})
                </button>
              );
            })}
          </div>

          {loadingProducts ? (
            <p className="py-8 text-center text-sm font-semibold text-[#94908C]">Loading product directory...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#94908C]">
              {products.length === 0
                ? "No products saved yet. Upload your first product photos above."
                : "No products found with this status."}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-none border-none md:border md:border-[#E5E2DC] bg-white p-4 md:p-0">
              <Table className="min-w-full table-auto">
                <TableHeader>
                  <TableRow className="bg-transparent md:bg-[#FCFAF7] border-b-0 md:border-b">
                    <TableHead className="pl-0 md:pl-4 font-bold text-[#1F2022] text-[11px] md:text-sm">Photo</TableHead>
                    <TableHead className="font-bold text-[#1F2022] text-[11px] md:text-sm">Name</TableHead>
                    <TableHead className="font-bold text-[#1F2022] text-[11px] md:text-sm">Price</TableHead>
                    <TableHead className="font-bold text-[#1F2022] text-[11px] md:text-sm">Status</TableHead>
                    <TableHead className="pr-0 md:pr-4 text-right font-bold text-[#1F2022] text-[11px] md:text-sm">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((p) => (
                    <TableRow key={p.id} className="border-b-0 md:border-b">
                      <TableCell className="pl-0 md:pl-4 py-2 md:py-4">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="h-10 w-10 md:h-12 md:w-12 rounded-none border border-transparent md:border-[#E5E2DC] object-cover bg-gray-400"
                          />
                        ) : (
                          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-none border border-transparent md:border-[#E5E2DC] bg-[#898989] text-lg">
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-bold text-[#1F2022] text-[10px] md:text-sm py-2 md:py-4 truncate max-w-[80px] md:max-w-none">{p.name}</TableCell>
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
                      <TableCell className="pr-0 md:pr-4 text-right py-2 md:py-4">
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <Button
                            size="sm"
                            variant={p.status === "published" ? "outline" : "default"}
                            disabled={togglingId === p.id || deletingId === p.id}
                            onClick={() => toggleStatus(p)}
                            className={`rounded-none px-1.5 md:px-3 h-6 md:h-9 text-[9px] md:text-xs font-bold cursor-pointer gap-1 md:gap-1.5 ${
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

      {/* Pop Up / Modal "Image Uploaded" (Strictly 0 Corner Radius: rounded-none) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-none border border-[#E5E2DC] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4">
              <h2 className="text-lg font-bold text-[#1F2022]">Image Uploaded</h2>
              <button
                type="button"
                onClick={handleCancelModal}
                className="flex h-8 w-8 items-center justify-center rounded-none text-[#1F2022]/70 hover:bg-[#FCFAF7] hover:text-[#1F2022] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5 font-black" />
              </button>
            </div>

            {/* Modal Content: Scrollable Grid of Uploaded Images (Strictly 0 Corner Radius: rounded-none) */}
            <div className="my-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {modalFiles.length === 0 ? (
                <div className="py-12 text-center text-sm font-semibold text-[#94908C]">
                  No images uploaded.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 p-2">
                  {modalPreviewUrls.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-none border border-[#E5E2DC] bg-[#FCFAF7] p-1">
                      <img
                        src={url}
                        alt={`Uploaded ${idx + 1}`}
                        className="h-full w-full rounded-none object-cover"
                      />

                      {/* Red Square Badge 'X' Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveFromModal(idx)}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-none bg-red-600 text-white font-extrabold text-xs shadow-md transition-transform hover:scale-110 cursor-pointer"
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Actions (Strictly 0 Corner Radius: rounded-none) */}
            <div className="flex items-center justify-center gap-4 border-t border-[#E5E2DC] pt-4">
              <Button
                type="button"
                onClick={handleSaveModal}
                className="h-10 min-w-[120px] rounded-none bg-[#707070] text-sm font-bold text-white hover:bg-[#1F2022] cursor-pointer"
              >
                Update
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelModal}
                className="h-10 min-w-[120px] rounded-none border-[#1F2022]/40 bg-[#707070]/70 text-sm font-bold text-white hover:bg-[#707070] cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

