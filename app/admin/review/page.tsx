"use client"; // reads sessionStorage + has editable fields: browser code

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

// one row on the review desk = name (editable) + AI draft (editable) + photo preview
interface ReviewRow {
  name: string;
  category: string;
  material: string;
  description: string;
  priceEstimate: number;
  imageBase64?: string;
  mimeType?: string;
}

export default function ReviewPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ReviewRow[] | null>(null); // null = "not loaded yet"
  const [failures, setFailures] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // read the notebook ONCE when the page opens
  useEffect(() => {
    const raw = sessionStorage.getItem("drafts");
    if (!raw) return; // stays null -> "no drafts" screen below

    const { items, results } = JSON.parse(raw);
    const good: ReviewRow[] = [];
    const bad: string[] = [];

    results.forEach((r: any, i: number) => {
      if (r.ok) {
        good.push({
          name: items[i].name,          // the name YOU gave the file
          ...r.draft,                   // what the AI wrote: category, material, description, priceEstimate
          imageBase64: items[i].imageBase64,
          mimeType: items[i].mimeType,
        });
      } else {
        bad.push(`${items[i].name}: ${r.error}`);
      }
    });

    setRows(good);
    setFailures(bad);
  }, []);

  // editing helper: update one field on one row
  function updateRow(i: number, field: keyof ReviewRow, value: string | number) {
    setRows((prev) => prev!.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  }

  // "Simpan Semua" -> hand approved rows to the warehouse door
  async function handleSaveAll() {
    if (!rows || rows.length === 0) return;
    setSaving(true);
    setMessage("");
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
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan");

      sessionStorage.removeItem("drafts"); // notebook is empty now
      setMessage(`✅ ${rows.length} produk tersimpan!`);
      setTimeout(() => router.push("/"), 1500); // go admire the storefront
    } catch (err: any) {
      setMessage(`❌ ${err?.message ?? "Terjadi kesalahan"}`);
      setSaving(false);
    }
  }

  // ---- nothing in the notebook: offer to go upload something ----
  if (rows === null) {
    return (
      <div className="p-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Review Hasil AI</h1>
        <p className="text-muted-foreground">Belum ada draft. Unggah foto dulu di halaman Upload.</p>
        <Button onClick={() => router.push("/admin")}>Ke Halaman Upload</Button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Review Hasil AI</h1>
        <Button onClick={handleSaveAll} disabled={saving || rows.length === 0}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {saving ? "Menyimpan..." : `Simpan Semua ke Database (${rows.length})`}
        </Button>
      </div>
      <p className="text-muted-foreground">
        Tinjau dan perbaiki hasil AI sebelum menampilkannya di etalase publik. Klik kolom untuk mengedit.
      </p>

      {failures.length > 0 && (
        <div className="border border-destructive/50 rounded-md p-4 text-sm">
          <p className="font-semibold mb-2">Foto yang gagal diproses:</p>
          <ul className="list-disc list-inside space-y-1">
            {failures.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}

      {message && <p className="text-sm font-medium">{message}</p>}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Deskripsi AI</TableHead>
              <TableHead className="w-[140px]">Harga (Rp)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>
                  {row.imageBase64 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`data:${row.mimeType};base64,${row.imageBase64}`}
                      alt={row.name}
                      className="h-14 w-14 rounded object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded bg-muted" />
                  )}
                </TableCell>
                <TableCell>
                  <Input value={row.name} onChange={(e) => updateRow(i, "name", e.target.value)} className="min-w-40" />
                </TableCell>
                <TableCell><Badge variant="secondary">{row.category}</Badge></TableCell>
                <TableCell>{row.material}</TableCell>
                <TableCell>
                  <Input value={row.description} onChange={(e) => updateRow(i, "description", e.target.value)} className="min-w-80" />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.priceEstimate}
                    onChange={(e) => updateRow(i, "priceEstimate", Number(e.target.value))}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {rows.length === 0 && failures.length > 0 && (
        <p className="text-sm text-muted-foreground">Semua foto gagal — coba unggah ulang.</p>
      )}
    </div>
  );
}