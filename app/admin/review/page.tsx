import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockReviewData = [
  {
    id: 1,
    name: "Topi Baseball Polos",
    material: "Cotton Twill",
    category: "Baseball Cap",
    description: "Topi baseball polos bahan cotton twill berkualitas, cocok untuk gaya kasual sehari-hari.",
    status: "Pending",
  },
  {
    id: 2,
    name: "Bucket Hat Vintage",
    material: "Canvas",
    category: "Bucket Hat",
    description: "Bucket hat gaya vintage dengan bahan canvas yang nyaman dan tahan lama untuk kegiatan outdoor.",
    status: "Pending",
  },
  {
    id: 3,
    name: "Snapback Premium",
    material: "Polyester",
    category: "Snapback",
    description: "Topi snapback premium yang dapat diatur ukurannya, memberikan tampilan urban dan modern.",
    status: "Pending",
  },
];

export default function ReviewPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Review Hasil AI</h1>
        <Button variant="default">Simpan Semua ke Database</Button>
      </div>
      <p className="text-muted-foreground">
        Tinjau deskripsi, material, dan kategori hasil generate AI sebelum menampilkannya di etalase publik.
      </p>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Deskripsi AI</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReviewData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">#{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.category}</Badge>
                </TableCell>
                <TableCell>{item.material}</TableCell>
                <TableCell className="max-w-xs truncate" title={item.description}>
                  {item.description}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
