import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteProductButton, ToggleStatusButton } from "./product-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

export const dynamic = "force-dynamic"; // Ensure fresh data on admin dashboard

export default async function ProductsPage() {
  // Ambil data asli dari database (Turso), terbaru dulu
  const products = await db
    .select()
    .from(productsTable)
    .orderBy(desc(productsTable.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight text-[#1F2022]">Product Catalog</h1>
        <p className="text-sm font-semibold text-[#1F2022]/70">
          Manage your products, visibility status, and inventory.
        </p>
      </div>

      <div className="rounded-none border border-[#1F2022] bg-[#FCFAF7] shadow-xs overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#D8D4CD]/50 border-b border-[#1F2022]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-extrabold text-[#1F2022]">ID / Image</TableHead>
              <TableHead className="font-extrabold text-[#1F2022]">Name & Slug</TableHead>
              <TableHead className="font-extrabold text-[#1F2022] text-right">Price</TableHead>
              <TableHead className="font-extrabold text-[#1F2022] text-center">Stock</TableHead>
              <TableHead className="font-extrabold text-[#1F2022] text-center">Status</TableHead>
              <TableHead className="font-extrabold text-[#1F2022] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center font-bold text-[#1F2022]/50">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="border-b border-[#E5E2DC] hover:bg-[#F0EEEA]">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <div className="h-10 w-10 shrink-0 border border-[#1F2022]/10 bg-gray-100 overflow-hidden rounded-none">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 shrink-0 border border-[#1F2022]/10 bg-gray-100 flex items-center justify-center rounded-none text-xs text-gray-400">
                          No Img
                        </div>
                      )}
                      <span className="text-xs text-gray-500 font-mono truncate max-w-[80px]">
                        {product.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1F2022]">{product.name}</span>
                      <span className="text-xs text-gray-500 font-mono">{product.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    Rp {product.price.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-none ${product.stockCount > 0 ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
                      {product.stockCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <ToggleStatusButton id={product.id} currentStatus={product.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 rounded-none border-[#1F2022]/20 text-[#1F2022] hover:bg-[#1F2022]/5"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
