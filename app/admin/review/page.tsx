"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, X, Loader } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchReviewData, updateReviewStatus, type ReviewItem, type ReviewStatus } from "@/lib/mock-admin-data";

const statusStyles: Record<ReviewStatus, { badge: "default" | "secondary" | "destructive"; color: string }> = {
  Pending: { badge: "secondary", color: "text-amber-600" },
  Approved: { badge: "default", color: "text-emerald-600" },
  Rejected: { badge: "destructive", color: "text-red-600" },
};

const statusIcons: Record<ReviewStatus, React.ReactNode> = {
  Pending: <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />,
  Approved: <Check className="h-4 w-4 text-emerald-600" />,
  Rejected: <X className="h-4 w-4 text-red-600" />,
};

export default function ReviewPage() {
  const [rows, setRows] = useState<ReviewItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ReviewStatus>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ id: number; status: ReviewStatus } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchReviewData();
        setRows(data);
        setSelectedItem(data[0] ?? null);
      } catch {
        setError("Gagal mengambil data review dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const handleStatusUpdate = async (id: number, nextStatus: ReviewStatus) => {
    try {
      setIsSaving(true);
      const nextRows = await updateReviewStatus(id, nextStatus);

      setRows(nextRows);
      setSelectedItem((current) => (current && current.id === id ? { ...current, status: nextStatus } : current));
      setConfirmDialog(null);
    } catch {
      setError("Gagal memperbarui status review.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen space-y-6 bg-linear-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div className="space-y-4 bg-linear-to-r from-slate-900 to-slate-800 p-6 md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Admin Dashboard</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Review Hasil AI</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200">Tinjau deskripsi, material, dan kategori hasil generate AI sebelum menampilkannya di etalase publik.</p>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <span>
                Total Produk: <span className="font-semibold text-slate-900">{rows.length}</span>
              </span>
              <span>
                Pending: <span className="font-semibold text-amber-600">{rows.filter((r) => r.status === "Pending").length}</span>
              </span>
              <span>
                Approved: <span className="font-semibold text-emerald-600">{rows.filter((r) => r.status === "Approved").length}</span>
              </span>
              <span>
                Rejected: <span className="font-semibold text-red-600">{rows.filter((r) => r.status === "Rejected").length}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Detail Panel - Above Table */}
        {selectedItem && (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden animate-slideUp">
            <div className="bg-linear-to-r from-slate-900 to-slate-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Detail Review - {selectedItem.name}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)} className="text-white hover:bg-white/20">
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Product Name */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">Nama Produk</p>
                  <h3 className="text-xl font-black text-slate-900">{selectedItem.name}</h3>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">Kategori</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-100 text-slate-700 text-xs font-medium">
                      {selectedItem.category}
                    </Badge>
                  </div>
                </div>

                {/* Material */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">Material</p>
                  <p className="font-semibold text-slate-900">{selectedItem.material}</p>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">{statusIcons[selectedItem.status]}</div>
                    <Badge variant={statusStyles[selectedItem.status].badge} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[selectedItem.status].color}`}>
                      {selectedItem.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-2">Tanggal Upload</p>
                <p className="text-sm text-slate-700">{selectedItem.createdAt}</p>
              </div>

              {/* Full Description */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-3">Deskripsi AI Lengkap</p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm leading-relaxed text-slate-700">{selectedItem.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-slate-200 flex gap-3">
                <Button variant="default" onClick={() => setConfirmDialog({ id: selectedItem.id, status: "Approved" })} className="flex-1 rounded-xl h-11 gap-2 font-semibold transition-all hover:shadow-md" disabled={isSaving}>
                  {isSaving && confirmDialog?.status === "Approved" ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Setujui
                </Button>
                <Button variant="destructive" onClick={() => setConfirmDialog({ id: selectedItem.id, status: "Rejected" })} className="flex-1 rounded-xl h-11 gap-2 font-semibold transition-all hover:shadow-md" disabled={isSaving}>
                  {isSaving && confirmDialog?.status === "Rejected" ? <Loader className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  Tolak
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Table Section */}
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-md gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama produk..."
                aria-label="Cari produk"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 px-4 transition-all focus:bg-white focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1">
              <span className="text-sm font-medium text-slate-600">Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "All" | ReviewStatus)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm font-medium outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                aria-label="Filter status produk"
              >
                <option value="All">Semua</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table or States */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-12 px-4 text-center">
              <Loader className="mb-3 h-8 w-8 animate-spin text-slate-400" />
              <p className="text-sm text-slate-600">Mengambil data review dari backend...</p>
            </div>
          ) : error ? (
            <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <X className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
              </div>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <p className="text-sm text-slate-500">Tidak ada data yang cocok dengan filter saat ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-linear-to-r from-slate-50 to-slate-100 hover:bg-slate-100">
                      <TableHead className="w-17.5 font-semibold text-slate-700">ID</TableHead>
                      <TableHead className="font-semibold text-slate-700">Nama Produk</TableHead>
                      <TableHead className="font-semibold text-slate-700">Kategori</TableHead>
                      <TableHead className="font-semibold text-slate-700">Material</TableHead>
                      <TableHead className="font-semibold text-slate-700">Deskripsi</TableHead>
                      <TableHead className="w-25 font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.map((item, idx) => (
                      <TableRow key={item.id} className={`transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-blue-50`}>
                        <TableCell className="font-bold text-slate-800">#{item.id}</TableCell>
                        <TableCell className="font-semibold text-slate-900">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-100 text-slate-700 text-xs font-medium">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-700 text-sm">{item.material}</TableCell>
                        <TableCell className="max-w-xs text-slate-600 text-sm">
                          <div className="line-clamp-2 hover:text-slate-900 transition-colors" title={item.description}>
                            {item.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">{statusIcons[item.status]}</div>
                            <Badge variant={statusStyles[item.status].badge} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[item.status].color}`}>
                              {item.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              className="rounded-lg text-xs"
                            >
                              Detail
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 space-y-4 animate-slideUp">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Konfirmasi Perubahan Status</h3>
              <p className="mt-2 text-sm text-slate-600">
                Anda akan mengubah status produk menjadi <span className="font-semibold">{confirmDialog.status}</span>. Lanjutkan?
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
              <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold">Produk</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedItem?.name}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setConfirmDialog(null)} className="flex-1 rounded-lg">
                Batal
              </Button>
              <Button variant={confirmDialog.status === "Rejected" ? "destructive" : "default"} onClick={() => handleStatusUpdate(confirmDialog.id, confirmDialog.status)} className="flex-1 rounded-lg gap-2" disabled={isSaving}>
                {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {confirmDialog.status === "Rejected" ? "Tolak" : "Setujui"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
