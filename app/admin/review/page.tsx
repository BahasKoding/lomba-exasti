"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ReviewStatus = "Pending" | "Approved" | "Rejected";

type ReviewItem = {
  id: number;
  name: string;
  category: string;
  material: string;
  description: string;
  status: ReviewStatus;
  createdAt: string;
};

const mockReviewData: ReviewItem[] = [
  {
    id: 1,
    name: "Topi Baseball Polos",
    material: "Cotton Twill",
    category: "Baseball Cap",
    description: "Topi baseball polos bahan cotton twill berkualitas, cocok untuk gaya kasual sehari-hari.",
    status: "Pending",
    createdAt: "2026-09-01",
  },
  {
    id: 2,
    name: "Bucket Hat Vintage",
    material: "Canvas",
    category: "Bucket Hat",
    description: "Bucket hat gaya vintage dengan bahan canvas yang nyaman dan tahan lama untuk kegiatan outdoor.",
    status: "Approved",
    createdAt: "2026-09-02",
  },
  {
    id: 3,
    name: "Snapback Premium",
    material: "Polyester",
    category: "Snapback",
    description: "Topi snapback premium yang dapat diatur ukurannya, memberikan tampilan urban dan modern.",
    status: "Pending",
    createdAt: "2026-09-02",
  },
  {
    id: 4,
    name: "Beanie Rajut Musim Dingin",
    material: "Wool",
    category: "Beanie",
    description: "Beanie rajut tebal dari bahan wool yang hangat dan nyaman untuk aktivitas luar ruangan di cuaca dingin.",
    status: "Rejected",
    createdAt: "2026-09-01",
  },
  {
    id: 5,
    name: "Dad Cap Sporty",
    material: "Mesh",
    category: "Dad Cap",
    description: "Dad cap sporty dengan bahan mesh yang ringkas dan ringan, pas untuk aktivitas harian dan olahraga ringan.",
    status: "Approved",
    createdAt: "2026-09-03",
  },
];

const statusStyles: Record<ReviewStatus, "default" | "secondary" | "destructive"> = {
  Pending: "secondary",
  Approved: "default",
  Rejected: "destructive",
};

async function fetchReviewData(): Promise<ReviewItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockReviewData;
}

export default function ReviewPage() {
  const [rows, setRows] = useState<ReviewItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ReviewStatus>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);

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

  const handleStatusUpdate = (id: number, nextStatus: ReviewStatus) => {
    setRows((current) => current.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
    setSelectedItem((current) => (current && current.id === id ? { ...current, status: nextStatus } : current));
  };

  return (
    <div className="space-y-6 bg-[#f7f5f2] p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Review Hasil AI</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Tinjau deskripsi, material, dan kategori hasil generate AI sebelum menampilkannya di etalase publik.</p>
          </div>

          <Button variant="default" className="h-11 rounded-xl px-5 font-semibold shadow-sm">
            Simpan Semua ke Database
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full max-w-md gap-2">
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama produk..." aria-label="Cari produk" className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3" />
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-sm font-medium text-slate-600">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "All" | ReviewStatus)}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus-visible:border-slate-400"
                  aria-label="Filter status produk"
                >
                  <option value="All">Semua</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">Mengambil data review dari backend...</div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            ) : filteredRows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">Tidak ada data yang cocok dengan filter saat ini.</div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-[80px] text-slate-600">ID</TableHead>
                      <TableHead className="text-slate-600">Nama Produk</TableHead>
                      <TableHead className="text-slate-600">Kategori</TableHead>
                      <TableHead className="text-slate-600">Material</TableHead>
                      <TableHead className="text-slate-600">Deskripsi</TableHead>
                      <TableHead className="text-slate-600">Status</TableHead>
                      <TableHead className="text-right text-slate-600">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.map((item) => (
                      <TableRow key={item.id} className="bg-white hover:bg-slate-50">
                        <TableCell className="font-semibold text-slate-700">#{item.id}</TableCell>
                        <TableCell className="font-medium text-slate-800">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-100 text-slate-700">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-700">{item.material}</TableCell>
                        <TableCell className="max-w-xs truncate text-slate-600" title={item.description}>
                          {item.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusStyles[item.status]} className="rounded-full px-2.5 py-1 text-[11px] font-semibold">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)} className="rounded-lg">
                              Detail
                            </Button>
                            <Button variant="default" size="sm" onClick={() => handleStatusUpdate(item.id, "Approved")} className="rounded-lg">
                              Approve
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

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Detail Review</h2>

            {selectedItem ? (
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Nama Produk</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">{selectedItem.name}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-100 text-slate-700">
                    {selectedItem.category}
                  </Badge>
                  <Badge variant={statusStyles[selectedItem.status]} className="rounded-full px-2.5 py-1 text-[11px] font-semibold">
                    {selectedItem.status}
                  </Badge>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Material</p>
                  <p className="mt-2 text-base font-semibold text-slate-800">{selectedItem.material}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Tanggal</p>
                  <p className="mt-2 text-base font-semibold text-slate-800">{selectedItem.createdAt}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Deskripsi AI</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{selectedItem.description}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="default" onClick={() => handleStatusUpdate(selectedItem.id, "Approved")} className="flex-1 rounded-xl">
                    Setujui
                  </Button>
                  <Button variant="destructive" onClick={() => handleStatusUpdate(selectedItem.id, "Rejected")} className="flex-1 rounded-xl">
                    Tolak
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500">Pilih produk dari tabel untuk melihat detail.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
