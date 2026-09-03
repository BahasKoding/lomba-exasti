"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle, AlertCircle, Loader } from "lucide-react";

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
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedFiles.length) {
      setError("Silakan pilih minimal satu file gambar terlebih dahulu.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setProgressMessage(`Mengubah ${selectedFiles.length} foto...`);

      const items = await Promise.all(selectedFiles.map(fileToItem));

      setProgressMessage("AI Gemini sedang menganalisis foto... (±10 detik per foto)");
      
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
    <div className="min-h-screen space-y-6 bg-[#FCFAF7] p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="overflow-hidden rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] shadow-sm">
          <div className="space-y-4 bg-[#1F2022] p-8 text-[#FCFAF7]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94908C]">Admin Dashboard</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight">Upload Massal</h1>
              <p className="mt-3 max-w-2xl text-sm text-[#94908C]">
                Unggah banyak gambar produk sekaligus. Sistem AI Gemini akan otomatis mendeteksi bahan, gaya, dan merangkai deskripsi komersial yang menarik.
              </p>
            </div>
          </div>

          <div className="border-t border-[#E5E2DC] bg-[#FCFAF7] px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <div>
                <p className="font-semibold text-[#1F2022]">File yang dipilih</p>
                <p className="text-[#94908C]">{selectedFiles.length} file</p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isUploading || selectedFiles.length === 0}
                size="lg"
                className="gap-2 rounded-full bg-[#1F2022] px-6 text-[#FCFAF7] font-semibold hover:bg-[#1F2022]/90"
              >
                {isUploading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Memproses AI...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-5 w-5" />
                    Mulai Generate AI ({selectedFiles.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Upload Card */}
        <div className="overflow-hidden rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] shadow-xs">
          <div className="space-y-6 p-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1F2022]">Area Unggah</h2>
              <p className="mt-2 text-sm text-[#94908C]">
                Pilih atau drag & drop gambar produk topi ke sini (JPG, PNG, WEBP — maks 5MB per file).
              </p>
            </div>

            {/* Upload Zone */}
            <div className="relative group">
              <input
                id="picture"
                type="file"
                multiple
                accept="image/*"
                disabled={isUploading}
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  setSelectedFiles(files);
                  setError(null);
                }}
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
              />
              <label
                htmlFor="picture"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E5E2DC] bg-[#FCFAF7] p-12 text-center transition-all hover:border-[#1F2022]"
              >
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-[#E5E2DC]/50 p-4">
                      <UploadCloud className="h-8 w-8 text-[#1F2022]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2022]">Tarik & Lepas Gambar</h3>
                    <p className="mt-1 text-sm text-[#94908C]">atau klik untuk memilih dari komputer Anda</p>
                  </div>
                  <p className="text-xs text-[#94908C]">JPG, PNG, WEBP hingga 5MB per file</p>
                </div>
              </label>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="rounded-2xl border border-[#E5E2DC] bg-[#FCFAF7] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <p className="font-semibold text-[#1F2022]">{selectedFiles.length} File Dipilih</p>
                </div>
                <div className="space-y-2">
                  {selectedFiles.slice(0, 5).map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-white p-2.5 px-3 border border-[#E5E2DC]">
                      <span className="truncate text-sm font-medium text-[#1F2022]">{file.name}</span>
                      <span className="text-xs font-semibold text-[#94908C]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                  {selectedFiles.length > 5 && (
                    <div className="px-3 py-1.5 text-xs font-semibold text-[#94908C]">
                      + {selectedFiles.length - 5} file lainnya
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Progress Message */}
            {isUploading && progressMessage && (
              <div className="flex items-center gap-3 rounded-2xl border border-[#E5E2DC] bg-[#FCFAF7] p-4 text-sm font-semibold text-[#1F2022]">
                <Loader className="h-5 w-5 animate-spin text-[#1F2022]" />
                {progressMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-2xl border border-[#E5E2DC] bg-[#FFFFFF] p-6 shadow-xs">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F2022] text-[#FCFAF7]">
                <span className="text-sm font-bold">i</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-[#1F2022]">Bagaimana cara kerjanya?</p>
              <ul className="space-y-1.5 text-sm text-[#94908C]">
                <li>1. Unggah foto produk topi Anda.</li>
                <li>2. AI Gemini 2.5 Vision menganalisis foto & mendeteksi kategori, material, dan membuat deskripsi komersial.</li>
                <li>3. Hasilnya akan tampil di halaman <strong>Review AI</strong> untuk direvisi & disimpan ke database Turso.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}