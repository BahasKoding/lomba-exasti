"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Check, 
  X, 
  Loader, 
  Save, 
  AlertTriangle, 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon, 
  CheckCheck, 
  Maximize2, 
  Eye,
  Tag,
  Sparkles,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchReviewData, type ReviewStatus } from "@/lib/mock-admin-data";

interface ReviewRow {
  id?: string | number;
  name: string;
  category: string;
  material: string;
  description: string;
  priceEstimate: number;
  imageBase64?: string;
  mimeType?: string;
  status: ReviewStatus;
}

const CATEGORY_OPTIONS = [
  "Baseball Cap",
  "Bucket Hat",
  "Snapback",
  "Beanie",
  "Trucker Cap",
  "Dad Hat",
  "Lainnya"
];

export default function ReviewPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [failures, setFailures] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ReviewStatus>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid"); // Grid mode by default for QA readability
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  // Lightbox preview popup state
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        setIsLoading(true);
        const raw = sessionStorage.getItem("drafts");

        if (raw) {
          const { items, results } = JSON.parse(raw);
          const good: ReviewRow[] = [];
          const bad: string[] = [];

          results.forEach((r: any, i: number) => {
            if (r.ok) {
              good.push({
                id: i + 1,
                name: items[i].name,
                category: r.draft?.category ?? "Baseball Cap",
                material: r.draft?.material ?? "Cotton Twill",
                description: r.draft?.description ?? "",
                priceEstimate: r.draft?.priceEstimate ?? 150000,
                imageBase64: items[i]?.imageBase64,
                mimeType: items[i]?.mimeType,
                status: "Pending",
              });
            } else {
              bad.push(`${items[i].name}: ${r.error}`);
            }
          });

          setRows(good);
          setFailures(bad);
        } else {
          // Fallback to existing database or mock review rows
          const fallbackData = await fetchReviewData();
          const mappedFallback: ReviewRow[] = fallbackData.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            material: item.material,
            description: item.description,
            priceEstimate: 149000,
            status: item.status,
          }));
          setRows(mappedFallback);
        }
      } catch (err: any) {
        setMessage({ text: `Gagal memuat data review: ${err.message}`, type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    loadDrafts();
  }, []);

  const updateRow = (index: number, field: keyof ReviewRow, value: any) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleApproveAllPending = () => {
    setRows((prev) =>
      prev.map((row) => (row.status === "Pending" ? { ...row, status: "Approved" } : row))
    );
    setMessage({
      text: "✓ Semua produk status Pending telah disetujui!",
      type: "success",
    });
  };

  const handleSaveAll = async () => {
    if (!rows.length) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: rows.map((r) => ({
            name: r.name,
            category: r.category,
            material: r.material,
            description: r.description,
            price: r.priceEstimate,
            imageBase64: r.imageBase64,
            mimeType: r.mimeType,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Gagal menyimpan ke database");
      }

      sessionStorage.removeItem("drafts");
      setMessage({
        text: `✓ Berhasil menyimpan ${rows.length} produk katalog ke database Turso! Mengalihkan ke Storefront...`,
        type: "success",
      });
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      setMessage({ text: `❌ ${err.message || "Terjadi kesalahan saat menyimpan"}`, type: "error" });
      setIsSaving(false);
    }
  };

  const filteredRows = rows.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.material.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = rows.filter((r) => r.status === "Pending").length;
  const approvedCount = rows.filter((r) => r.status === "Approved").length;

  return (
    <div className="min-h-screen space-y-6 bg-[#FCFAF7] p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* HEADER DASHBOARD BANNER */}
        <div className="overflow-hidden rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] shadow-sm">
          <div className="flex flex-col justify-between gap-4 bg-[#1F2022] p-6 text-[#FCFAF7] md:flex-row md:items-center md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94908C]">Admin Dashboard</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">Review Hasil AI</h1>
              <p className="mt-2 max-w-xl text-sm text-[#94908C]">
                Tinjau, edit, dan verifikasi deskripsi komersial & harga hasil analisis AI sebelum disimpan ke Turso Database.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {pendingCount > 0 && (
                <Button
                  onClick={handleApproveAllPending}
                  variant="outline"
                  size="lg"
                  className="gap-2 rounded-full border-[#E5E2DC] bg-white text-[#1F2022] font-semibold hover:bg-[#FCFAF7]"
                >
                  <CheckCheck className="h-4 w-4 text-emerald-600" />
                  Setujui Semua Pending ({pendingCount})
                </Button>
              )}

              <Button
                onClick={handleSaveAll}
                disabled={isSaving || rows.length === 0}
                size="lg"
                className="gap-2 rounded-full bg-emerald-600 px-6 text-white font-semibold hover:bg-emerald-700 shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Simpan Semua ke Database ({rows.length})
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* STATS SUMMARY BAR */}
          <div className="border-t border-[#E5E2DC] bg-[#FCFAF7] px-6 py-4 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[#94908C]">Total Draft: </span>
                  <span className="font-bold text-[#1F2022]">{rows.length}</span>
                </div>
                <div>
                  <span className="text-[#94908C]">Pending: </span>
                  <span className="font-bold text-amber-600">{pendingCount}</span>
                </div>
                <div>
                  <span className="text-[#94908C]">Approved: </span>
                  <span className="font-bold text-emerald-600">{approvedCount}</span>
                </div>
              </div>

              {/* VIEW MODE TOGGLE BUTTONS */}
              <div className="flex items-center gap-1 rounded-2xl border border-[#E5E2DC] bg-white p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    viewMode === "grid"
                      ? "bg-[#1F2022] text-[#FCFAF7] shadow-xs"
                      : "text-[#94908C] hover:text-[#1F2022]"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Kartu (Grid)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    viewMode === "table"
                      ? "bg-[#1F2022] text-[#FCFAF7] shadow-xs"
                      : "text-[#94908C] hover:text-[#1F2022]"
                  }`}
                >
                  <TableIcon className="h-3.5 w-3.5" />
                  <span>Tabel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* NOTIFICATION MESSAGES */}
        {message && (
          <div
            className={`rounded-2xl border p-4 text-sm font-semibold shadow-xs ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* FAILURES ALERT */}
        {failures.length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Foto yang gagal diproses AI ({failures.length}):</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {failures.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* SEARCH & FILTER CONTROLS */}
        <div className="rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] p-6 shadow-xs space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#94908C]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama produk, kategori, atau bahan..."
                className="h-11 rounded-2xl border-[#E5E2DC] bg-[#FCFAF7] pl-10 text-sm text-[#1F2022] placeholder-[#94908C]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-[#E5E2DC] bg-[#FCFAF7] px-3.5 py-2 text-xs font-semibold text-[#1F2022]">
                <Filter className="h-3.5 w-3.5 text-[#94908C]" />
                <span className="text-[#94908C]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-transparent font-bold text-[#1F2022] outline-none cursor-pointer"
                >
                  <option value="All">Semua ({rows.length})</option>
                  <option value="Pending">Pending ({pendingCount})</option>
                  <option value="Approved">Approved ({approvedCount})</option>
                  <option value="Rejected">Rejected ({rows.filter(r => r.status === "Rejected").length})</option>
                </select>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#94908C] space-y-2">
              <Loader className="h-6 w-6 animate-spin text-[#1F2022]" />
              <p className="text-sm font-semibold">Memuat draft AI...</p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="py-16 text-center text-sm font-medium text-[#94908C]">
              Tidak ada data draft AI yang cocok. Silakan unggah foto di menu Upload.
            </div>
          ) : viewMode === "grid" ? (
            
            /* ================= GRID / CARD VIEW (REKOMENDASI QA) ================= */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filteredRows.map((row, idx) => {
                const realIndex = rows.findIndex((r) => r === row);
                const imgSrc = row.imageBase64 ? `data:${row.mimeType};base64,${row.imageBase64}` : null;

                return (
                  <div
                    key={idx}
                    className="flex flex-col overflow-hidden rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] shadow-xs hover:shadow-md transition-all space-y-4 p-5"
                  >
                    {/* Card Header Top Bar */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#FCFAF7] border border-[#E5E2DC] px-2.5 py-0.5 text-xs font-bold text-[#94908C]">
                        #{realIndex + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`rounded-full border text-[11px] font-bold px-3 py-0.5 ${
                            row.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : row.status === "Rejected"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {row.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Image & Main Specs */}
                    <div className="flex gap-4">
                      {/* Image Thumbnail */}
                      <div className="relative group shrink-0">
                        {imgSrc ? (
                          <div
                            onClick={() => setLightbox({ src: imgSrc, title: row.name })}
                            className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[#E5E2DC] bg-[#FCFAF7] cursor-pointer shadow-xs"
                          >
                            <img
                              src={imgSrc}
                              alt={row.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                              <Maximize2 className="h-4 w-4" />
                            </div>
                          </div>
                        ) : (
                          <div className="h-24 w-24 rounded-2xl bg-[#FCFAF7] border border-[#E5E2DC] flex items-center justify-center text-2xl">
                            🧢
                          </div>
                        )}
                      </div>

                      {/* Name & Category Controls */}
                      <div className="flex-1 space-y-2.5 min-w-0">
                        <div>
                          <label className="text-[11px] font-bold text-[#94908C] uppercase tracking-wider block mb-1">
                            Nama Produk
                          </label>
                          <Input
                            value={row.name}
                            onChange={(e) => updateRow(realIndex, "name", e.target.value)}
                            className="h-9 rounded-xl border-[#E5E2DC] bg-white font-bold text-[#1F2022] text-xs focus:border-[#1F2022]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#94908C] uppercase tracking-wider block mb-1">
                            Kategori Topi
                          </label>
                          <select
                            value={row.category}
                            onChange={(e) => updateRow(realIndex, "category", e.target.value)}
                            className="w-full h-8 rounded-xl border border-[#E5E2DC] bg-[#FCFAF7] px-2.5 text-xs font-bold text-[#1F2022] outline-none cursor-pointer"
                          >
                            {CATEGORY_OPTIONS.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Material & Price Row */}
                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#E5E2DC]">
                      <div>
                        <label className="text-[11px] font-bold text-[#94908C] uppercase tracking-wider block mb-1">
                          Bahan Material
                        </label>
                        <Input
                          value={row.material}
                          onChange={(e) => updateRow(realIndex, "material", e.target.value)}
                          className="h-9 rounded-xl border-[#E5E2DC] bg-[#FCFAF7] text-xs font-semibold text-[#1F2022]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#94908C] uppercase tracking-wider block mb-1">
                          Estimasi Harga (Rp)
                        </label>
                        <Input
                          type="number"
                          value={row.priceEstimate}
                          onChange={(e) => updateRow(realIndex, "priceEstimate", Number(e.target.value))}
                          className="h-9 rounded-xl border-[#E5E2DC] bg-white font-black text-xs text-[#1F2022]"
                        />
                      </div>
                    </div>

                    {/* AI Commercial Description (Multi-line Textarea so FULL text is visible!) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#94908C] uppercase tracking-wider">
                          Deskripsi AI Komersial
                        </label>
                        <span className="text-[10px] text-[#94908C]">Editable</span>
                      </div>
                      <textarea
                        value={row.description}
                        onChange={(e) => updateRow(realIndex, "description", e.target.value)}
                        rows={3}
                        className="w-full rounded-2xl border border-[#E5E2DC] bg-[#FCFAF7] p-3 text-xs text-[#1F2022] leading-relaxed outline-none focus:border-[#1F2022] focus:bg-white resize-y font-normal"
                        placeholder="Deskripsi hasil AI..."
                      />
                    </div>

                    {/* Card Actions Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E5E2DC]">
                      <span className="text-[11px] text-[#94908C]">Aksi Status:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateRow(realIndex, "status", "Approved")}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1 transition-all ${
                            row.status === "Approved"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-[#FCFAF7] border border-[#E5E2DC] text-[#1F2022] hover:bg-emerald-50 hover:text-emerald-700"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Setujui</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateRow(realIndex, "status", "Rejected")}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1 transition-all ${
                            row.status === "Rejected"
                              ? "bg-red-600 text-white shadow-xs"
                              : "bg-[#FCFAF7] border border-[#E5E2DC] text-[#94908C] hover:bg-red-50 hover:text-red-700"
                          }`}
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Tolak</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (

            /* ================= TABLE VIEW ================= */
            <div className="overflow-x-auto rounded-2xl border border-[#E5E2DC]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FCFAF7]">
                    <TableHead className="font-bold text-[#1F2022] w-16">Foto</TableHead>
                    <TableHead className="font-bold text-[#1F2022] min-w-44">Nama Produk (Editable)</TableHead>
                    <TableHead className="font-bold text-[#1F2022] min-w-36">Kategori</TableHead>
                    <TableHead className="font-bold text-[#1F2022] min-w-28">Material</TableHead>
                    <TableHead className="font-bold text-[#1F2022] min-w-72">Deskripsi AI (Editable)</TableHead>
                    <TableHead className="font-bold text-[#1F2022] min-w-32">Harga (Rp)</TableHead>
                    <TableHead className="font-bold text-[#1F2022] min-w-28">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row, idx) => {
                    const realIndex = rows.findIndex((r) => r === row);
                    const imgSrc = row.imageBase64 ? `data:${row.mimeType};base64,${row.imageBase64}` : null;

                    return (
                      <TableRow key={idx} className="hover:bg-[#FCFAF7]/60">
                        <TableCell>
                          {imgSrc ? (
                            <button
                              type="button"
                              onClick={() => setLightbox({ src: imgSrc, title: row.name })}
                              className="group relative h-14 w-14 overflow-hidden rounded-xl border border-[#E5E2DC] bg-white cursor-pointer shadow-xs"
                            >
                              <img
                                src={imgSrc}
                                alt={row.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </button>
                          ) : (
                            <div className="h-14 w-14 rounded-xl bg-[#FCFAF7] border border-[#E5E2DC] flex items-center justify-center text-xs text-[#94908C]">
                              🧢
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={row.name}
                            onChange={(e) => updateRow(realIndex, "name", e.target.value)}
                            className="rounded-xl border-[#E5E2DC] bg-white font-semibold text-[#1F2022] text-xs"
                          />
                        </TableCell>
                        <TableCell>
                          <select
                            value={row.category}
                            onChange={(e) => updateRow(realIndex, "category", e.target.value)}
                            className="w-full h-9 rounded-xl border border-[#E5E2DC] bg-[#FCFAF7] px-2.5 text-xs font-bold text-[#1F2022] outline-none cursor-pointer"
                          >
                            {CATEGORY_OPTIONS.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={row.material}
                            onChange={(e) => updateRow(realIndex, "material", e.target.value)}
                            className="rounded-xl border-[#E5E2DC] bg-[#FCFAF7] text-xs font-medium text-[#1F2022]"
                          />
                        </TableCell>
                        <TableCell>
                          {/* Multi-line Textarea so AI description is easy to read! */}
                          <textarea
                            value={row.description}
                            onChange={(e) => updateRow(realIndex, "description", e.target.value)}
                            rows={2}
                            className="w-full rounded-xl border border-[#E5E2DC] bg-white p-2.5 text-xs text-[#1F2022] outline-none focus:border-[#1F2022] resize-y font-normal"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={row.priceEstimate}
                            onChange={(e) => updateRow(realIndex, "priceEstimate", Number(e.target.value))}
                            className="w-32 rounded-xl border-[#E5E2DC] bg-white font-bold text-xs text-[#1F2022]"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`rounded-full border text-[10px] font-bold px-2.5 py-0.5 cursor-pointer ${
                              row.status === "Approved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : row.status === "Rejected"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                            onClick={() =>
                              updateRow(
                                realIndex,
                                "status",
                                row.status === "Pending" ? "Approved" : row.status === "Approved" ? "Rejected" : "Pending"
                              )
                            }
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* LIGHTBOX PREVIEW POPUP */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl overflow-hidden rounded-3xl border border-[#2A2C30] bg-[#141517] p-5 text-white shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#2A2C30] pb-3">
              <h3 className="font-bold text-sm text-amber-400 truncate">{lightbox.title}</h3>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="rounded-full bg-[#222428] p-1.5 text-[#B8B4AE] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-center max-h-[70vh] overflow-hidden rounded-2xl bg-black">
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="max-h-[70vh] w-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}