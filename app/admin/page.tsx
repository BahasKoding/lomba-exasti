"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { submitUploadFiles } from "@/lib/mock-admin-data";

export default function AdminDashboard() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedFiles.length) {
      setError("Silakan pilih minimal satu file gambar terlebih dahulu.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setSuccessMessage(null);

      const result = await submitUploadFiles(selectedFiles);

      if (!result.success || !result.data.length) {
        throw new Error("Gagal mengirim file ke AI.");
      }

      setSuccessMessage(`✓ Berhasil memproses ${result.count ?? selectedFiles.length} file untuk review AI.`);
      setSelectedFiles([]);
      const input = document.getElementById("picture") as HTMLInputElement | null;
      if (input) input.value = "";
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengirim file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen space-y-6 bg-linear-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div className="space-y-4 bg-linear-to-r from-slate-900 to-slate-800 p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Admin Dashboard</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Upload Massal</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200">Unggah banyak gambar produk sekaligus. Sistem AI akan otomatis mendeteksi bahan, gaya, dan merangkai deskripsi komersial yang menarik.</p>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <div>
                <p className="font-semibold text-slate-900">File yang dipilih</p>
                <p className="text-slate-600">{selectedFiles.length} file</p>
              </div>
              <Button onClick={handleSubmit} disabled={isUploading || selectedFiles.length === 0} size="lg" className="rounded-xl gap-2 font-semibold">
                {isUploading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-5 w-5" />
                    Mulai Generate AI
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Upload Card */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="space-y-6 p-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Area Unggah</h2>
              <p className="mt-2 text-sm text-slate-600">Drag and drop gambar produk topi ke sini atau klik untuk memilih file. Mendukung format JPG, PNG, WEBP (maks 5MB per file).</p>
            </div>

            {/* Upload Zone */}
            <div className="relative group">
              <input
                id="picture"
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);
                  setSelectedFiles(files);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <label
                htmlFor="picture"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-linear-to-br from-slate-50 to-slate-100 p-12 text-center transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 group-hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-slate-200 p-4">
                      <UploadCloud className="h-8 w-8 text-slate-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Tarik & Lepas Gambar</h3>
                    <p className="mt-1 text-sm text-slate-600">atau klik untuk memilih dari komputer Anda</p>
                  </div>
                  <p className="text-xs text-slate-500">JPG, PNG, WEBP hingga 5MB per file</p>
                </div>
              </label>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <p className="font-semibold text-slate-900">{selectedFiles.length} File Dipilih</p>
                </div>
                <div className="space-y-2">
                  {selectedFiles.slice(0, 5).map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-2 px-3">
                      <span className="text-sm text-slate-700 truncate">{file.name}</span>
                      <span className="text-xs font-medium text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                  {selectedFiles.length > 5 && <div className="text-sm text-slate-600 px-3 py-2">+ {selectedFiles.length - 5} file lainnya</div>}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex gap-3 animate-slideUp">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">Berhasil!</p>
                  <p className="text-sm text-emerald-700">{successMessage}</p>
                  <p className="text-xs text-emerald-600 mt-2">
                    File siap untuk direview. Buka halaman <strong>Review AI</strong> untuk melihat hasilnya.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-200">
                <span className="text-sm font-bold text-blue-700">i</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-blue-900">Bagaimana cara kerjanya?</p>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>1. Unggah foto produk topi Anda</li>
                <li>2. Sistem AI akan menganalisis gambar dan membuat deskripsi</li>
                <li>
                  3. Hasilnya akan tampil di halaman <strong>Review AI</strong> untuk Anda verifikasi
                </li>
                <li>4. Setujui atau tolak setiap produk sebelum ditampilkan di etalase publik</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
