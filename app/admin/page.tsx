"use client"; // this page runs in the browser: it reads files, shows progress

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// browser file -> { name, base64, mimeType } (the shape /api/ingest expects)
async function fileToItem(file: File) {
  const imageBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result); // "data:image/png;base64,XXXX"
      resolve(result.split(",")[1] ?? "");  // chop off the prefix, keep raw base64
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return { name: file.name.replace(/\.[^.]+$/, ""), imageBase64, mimeType: file.type };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");

  async function handleGenerate() {
    if (files.length === 0) return;
    setBusy(true);
    try {
      setProgress(`Mengubah ${files.length} foto...`);
      const items = await Promise.all(files.map(fileToItem));

      setProgress("AI sedang menganalisis foto... (±10 detik per foto)");
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ingest gagal");

      // pass the notes to the review page (small browser memory)
      sessionStorage.setItem("drafts", JSON.stringify({ items, results: data.results }));
      router.push("/admin/review");
    } catch (err: any) {
      alert(err?.message ?? "Terjadi kesalahan");
      setBusy(false);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Upload Massal</h1>
        <Button onClick={handleGenerate} disabled={busy || files.length === 0}>
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {busy ? "Memproses..." : `Mulai Generate AI (${files.length})`}
        </Button>
      </div>
      <p className="text-muted-foreground">
        Unggah banyak gambar produk sekaligus. Sistem AI akan otomatis mendeteksi bahan, gaya, dan merangkai deskripsi.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Area Unggah</CardTitle>
          <CardDescription>Pilih gambar produk topi (JPG, PNG, WEBP — maks 5MB per file).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-accent/50 cursor-pointer transition-colors">
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">Pilih File</h3>
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
              <Label htmlFor="picture" className="sr-only">Pilih File</Label>
              <Input
                id="picture"
                type="file"
                multiple
                accept="image/*"
                disabled={busy}
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
            </div>
            {files.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                {files.length} foto siap: {files.map(f => f.name).join(", ")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {busy && <p className="text-sm text-muted-foreground">{progress}</p>}
    </div>
  );
}