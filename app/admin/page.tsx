"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UploadCloud, AlertCircle, Loader, X, Info } from "lucide-react";

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

  // Generate object URLs for image preview thumbnails
  const previewUrls = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  const modalPreviewUrls = useMemo(() => {
    return modalFiles.map((file) => URL.createObjectURL(file));
  }, [modalFiles]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setError(null);
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
      setError("Silakan pilih minimal satu file gambar terlebih dahulu.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setProgressMessage(`Mengunggah & mengonversi ${selectedFiles.length} foto...`);

      const items = await Promise.all(selectedFiles.map(fileToItem));

      setProgressMessage("AI Gemini sedang menganalisis foto produk... (±10 detik per foto)");

      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal memproses gambar dengan AI.");
      }

      sessionStorage.setItem("drafts", JSON.stringify({ items, results: data.results }));
      router.push("/admin/review");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengirim file.");
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1F2022]">Bulk Massal</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-[#1F2022]/80">
          Seamlessly upload your entire collection in a single batch. Intelligent AI vision instantly analyzes each piece's
          fabric and aesthetic, effortlessly crafting bespoke commercial descriptions for your catalog.
        </p>
      </div>

      {/* Main Container Wireframe Card */}
      <div className="relative overflow-visible rounded-3xl border border-[#E5E2DC] bg-[#D8D4CD]/30 p-6 md:p-10 shadow-xs">
        {/* Circled 'i' Info Icon (Top Right) */}
        <div className="absolute right-6 top-6 z-20">
          <div
            className="relative"
            onMouseEnter={() => setShowInfoPopup(true)}
            onMouseLeave={() => setShowInfoPopup(false)}
          >
            <button
              type="button"
              onClick={() => setShowInfoPopup((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1F2022]/30 bg-white text-[#1F2022] transition-all duration-200 hover:scale-105 hover:border-[#1F2022] hover:bg-[#1F2022] hover:text-[#FCFAF7] shadow-2xs"
              title="Informasi Alur Kerja"
            >
              <Info className="h-5 w-5" />
            </button>

            {/* Floating Pop-up: "How It Works" */}
            {showInfoPopup && (
              <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-[#E5E2DC] bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
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
              className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#1F2022]/40 bg-white p-8 text-center transition-all duration-300 group-hover:border-[#1F2022] group-hover:bg-[#FCFAF7] shadow-2xs"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCFAF7] border border-[#E5E2DC] text-[#1F2022] group-hover:scale-110 transition-transform">
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

        {/* File Preview Bar & Count (as in admin page-1) */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#94908C]">
            {selectedFiles.length} File{selectedFiles.length !== 1 && "s"}
          </p>

          {/* Uploaded Thumbnails + "More" Box */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl">
              {previewUrls.slice(0, 5).map((url, idx) => (
                <div
                  key={idx}
                  className="relative group h-16 w-16 overflow-hidden rounded-xl border border-[#E5E2DC] bg-white shadow-2xs"
                >
                  <img src={url} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveDirect(idx)}
                    className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hapus gambar"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}

              {/* "More" Square Card */}
              <button
                type="button"
                onClick={openModal}
                className="flex h-16 w-20 flex-col items-center justify-center rounded-xl border border-[#1F2022] bg-white px-2 text-xs font-black text-[#1F2022] hover:bg-[#1F2022] hover:text-white transition-colors duration-200 shadow-2xs cursor-pointer"
              >
                <span>More</span>
                <span className="text-[10px] font-normal text-[#94908C]">({selectedFiles.length})</span>
              </button>
            </div>
          )}

          {/* Action Generate Button */}
          <div className="mt-2">
            <Button
              onClick={handleSubmit}
              disabled={isUploading || selectedFiles.length === 0}
              size="lg"
              className="h-11 min-w-[200px] rounded-xl bg-[#707070] px-8 text-sm font-bold text-white transition-all hover:bg-[#1F2022] disabled:opacity-50"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                "Generate"
              )}
            </Button>
          </div>

          {/* Progress / Error Alerts */}
          {isUploading && progressMessage && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#E5E2DC] bg-white p-3.5 text-xs font-semibold text-[#1F2022]">
              <Loader className="h-4 w-4 animate-spin text-[#1F2022]" />
              <span>{progressMessage}</span>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-bold text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pop Up / Modal "Image Uploaded" (Wireframe admin page-2) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E5E2DC] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4">
              <h2 className="text-lg font-bold text-[#1F2022]">Image Uploaded</h2>
              <button
                type="button"
                onClick={handleCancelModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1F2022]/70 hover:bg-[#FCFAF7] hover:text-[#1F2022] transition-colors"
              >
                <X className="h-5 w-5 font-black" />
              </button>
            </div>

            {/* Modal Content: Scrollable Grid of Uploaded Images */}
            <div className="my-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {modalFiles.length === 0 ? (
                <div className="py-12 text-center text-sm font-semibold text-[#94908C]">
                  Tidak ada gambar yang diunggah.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 p-2">
                  {modalPreviewUrls.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg border border-[#E5E2DC] bg-[#FCFAF7] p-1">
                      <img
                        src={url}
                        alt={`Uploaded ${idx + 1}`}
                        className="h-full w-full rounded-md object-cover"
                      />

                      {/* Red Circular Badge 'X' Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveFromModal(idx)}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-extrabold text-xs shadow-md transition-transform hover:scale-110 cursor-pointer"
                        title="Hapus foto ini"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-center gap-4 border-t border-[#E5E2DC] pt-4">
              <Button
                type="button"
                onClick={handleSaveModal}
                className="h-10 min-w-[120px] rounded-lg bg-[#707070] text-sm font-bold text-white hover:bg-[#1F2022]"
              >
                Update
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelModal}
                className="h-10 min-w-[120px] rounded-lg border-[#1F2022]/40 bg-[#707070]/70 text-sm font-bold text-white hover:bg-[#707070]"
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