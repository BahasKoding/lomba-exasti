"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader, Save, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchReviewData, type ReviewItem, type ReviewStatus } from "@/lib/mock-admin-data";

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

export default function ReviewPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [failures, setFailures] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ReviewStatus>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ReviewRow | null>(null);

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
          if (good.length > 0) setSelectedItem(good[0]);
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
          if (mappedFallback.length > 0) setSelectedItem(mappedFallback[0]);
        }
      } catch (err: any) {
        setMessage(`Error: ${err.message || "Gagal memuat data review"}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadDrafts();
  }, []);

  const updateRow = (index: number, field: keyof ReviewRow, value: any) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i === index) {
          const updated = { ...row, [field]: value };
          if (selectedItem && selectedItem.id === row.id) {
            setSelectedItem(updated);
          }
          return updated;
        }
        return row;
      })
    );
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
      setMessage(`✓ Berhasil menyimpan ${rows.length} produk ke Turso Database! Redirecting...`);
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Terjadi kesalahan saat menyimpan"}`);
      setIsSaving(false);
    }
  };

  const filteredRows = rows.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen space-y-6 bg-[#FCFAF7] p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="overflow-hidden rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] shadow-sm">
          <div className="flex flex-col justify-between gap-4 bg-[#1F2022] p-6 text-[#FCFAF7] md:flex-row md:items-center md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94908C]">Admin Dashboard</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight">Review Hasil AI</h1>
              <p className="mt-2 max-w-xl text-sm text-[#94908C]">
                Tinjau, edit, dan setujui deskripsi & harga hasil AI sebelum disimpan ke Turso Database.
              </p>
            </div>
            <Button
              onClick={handleSaveAll}
              disabled={isSaving || rows.length === 0}
              size="lg"
              className="gap-2 rounded-full bg-[#FCFAF7] px-6 text-[#1F2022] font-semibold hover:bg-white"
            >
              {isSaving ? <Loader className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {isSaving ? "Menyimpan..." : `Simpan Semua ke Database (${rows.length})`}
            </Button>
          </div>

          <div className="border-t border-[#E5E2DC] bg-[#FCFAF7] p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#1F2022]">
              <span>
                Total Draft: <span className="font-bold">{rows.length}</span>
              </span>
              <span>
                Pending: <span className="font-bold text-amber-600">{rows.filter((r) => r.status === "Pending").length}</span>
              </span>
              <span>
                Approved: <span className="font-bold text-emerald-600">{rows.filter((r) => r.status === "Approved").length}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div className="rounded-2xl border border-[#E5E2DC] bg-white p-4 text-sm font-semibold text-[#1F2022] shadow-xs">
            {message}
          </div>
        )}

        {/* Failures Banner */}
        {failures.length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="h-4 w-4" />
              Foto yang gagal diproses AI:
            </div>
            <ul className="list-disc list-inside space-y-1">
              {failures.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Table Section */}
        <div className="space-y-4 rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] p-6 shadow-xs">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama produk..."
              className="h-11 max-w-md rounded-2xl border-[#E5E2DC] bg-[#FFFFFF] text-[#1F2022] placeholder-[#94908C]"
            />
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#94908C]">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-10 rounded-xl border border-[#E5E2DC] bg-[#FFFFFF] px-3 text-sm font-semibold text-[#1F2022] outline-none"
              >
                <option value="All">Semua</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16 text-[#94908C]">
              <Loader className="mr-2 h-5 w-5 animate-spin text-[#1F2022]" />
              Memuat draft AI...
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="py-16 text-center text-sm font-medium text-[#94908C]">
              Tidak ada data draft AI. Silakan unggah foto di menu Upload.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#E5E2DC]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FCFAF7]">
                    <TableHead className="font-bold text-[#1F2022]">Foto</TableHead>
                    <TableHead className="font-bold text-[#1F2022]">Nama Produk (Editable)</TableHead>
                    <TableHead className="font-bold text-[#1F2022]">Kategori</TableHead>
                    <TableHead className="font-bold text-[#1F2022]">Material</TableHead>
                    <TableHead className="font-bold text-[#1F2022]">Deskripsi AI (Editable)</TableHead>
                    <TableHead className="font-bold text-[#1F2022]">Estimasi Harga (Rp)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-[#FCFAF7]/60">
                      <TableCell>
                        {row.imageBase64 ? (
                          <img
                            src={`data:${row.mimeType};base64,${row.imageBase64}`}
                            alt={row.name}
                            className="h-14 w-14 rounded-xl object-cover border border-[#E5E2DC]"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-xl bg-[#FCFAF7] border border-[#E5E2DC] flex items-center justify-center text-xs text-[#94908C]">
                            🧢
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.name}
                          onChange={(e) => updateRow(idx, "name", e.target.value)}
                          className="min-w-44 rounded-xl border-[#E5E2DC] bg-white font-semibold text-[#1F2022]"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full border-[#E5E2DC] bg-[#FCFAF7] text-xs font-bold text-[#1F2022]">
                          {row.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-[#1F2022]">{row.material}</TableCell>
                      <TableCell>
                        <Input
                          value={row.description}
                          onChange={(e) => updateRow(idx, "description", e.target.value)}
                          className="min-w-72 rounded-xl border-[#E5E2DC] bg-white text-xs text-[#1F2022]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.priceEstimate}
                          onChange={(e) => updateRow(idx, "priceEstimate", Number(e.target.value))}
                          className="w-32 rounded-xl border-[#E5E2DC] bg-white font-bold text-[#1F2022]"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}