import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Upload Massal</h1>
        <Button>Mulai Generate AI</Button>
      </div>
      <p className="text-muted-foreground">
        Unggah banyak gambar produk sekaligus. Sistem AI akan otomatis mendeteksi bahan, gaya, dan merangkai deskripsi.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Area Unggah</CardTitle>
          <CardDescription>Drag and drop gambar produk topi ke sini atau klik untuk memilih file.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-accent/50 cursor-pointer transition-colors">
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">Tarik & Lepas Gambar</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Mendukung format JPG, PNG, WEBP (maks 5MB per file)</p>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture" className="sr-only">Pilih File</Label>
              <Input id="picture" type="file" multiple accept="image/*" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
