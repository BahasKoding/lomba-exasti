import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Upload Massal</h1>
        <Button>Mulai Generate AI</Button>
      </div>
      <p className="text-muted-foreground">Unggah banyak gambar produk sekaligus. Sistem AI akan otomatis mendeteksi bahan, gaya, dan merangkai deskripsi.</p>

      <Card>
        <CardHeader>
          <CardTitle>Area Unggah</CardTitle>
          <CardDescription>Drag and drop gambar produk topi ke sini atau klik untuk memilih file.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors hover:bg-accent/50">
            <UploadCloud className="mb-4 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Tarik & Lepas Gambar</h3>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">Mendukung format JPG, PNG, WEBP (maks 5MB per file)</p>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture" className="sr-only">
                Pilih File
              </Label>
              <Input id="picture" type="file" multiple accept="image/*" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
