import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditProductForm } from "./edit-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const product = await db.select().from(productsTable).where(eq(productsTable.id, id)).get();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="inline-flex h-8 w-8 items-center justify-center rounded-none border border-[#1F2022] bg-[#FCFAF7] text-[#1F2022] hover:bg-[#D8D4CD] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#1F2022]">Edit Product</h1>
          <p className="text-sm font-semibold text-[#1F2022]/70">
            ID: <span className="font-mono">{product.id}</span>
          </p>
        </div>
      </div>

      <EditProductForm product={product} />
    </div>
  );
}
