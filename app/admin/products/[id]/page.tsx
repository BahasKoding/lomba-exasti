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
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
      {/* Header Block */}
      <div className="space-y-3">
        <Link
          href="/admin/products"
          className="group inline-flex items-center gap-2 text-xs font-bold text-[#1F2022]/70 hover:text-[#1F2022] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Products</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E2DC] pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1F2022]">Edit Product</h1>
            <p className="text-xs md:text-sm text-[#94908C] mt-1">
              Update catalog details, pricing, inventory, and AI descriptions.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 self-start sm:self-center px-2.5 py-1 bg-[#FCFAF7] border border-[#E5E2DC] text-[11px] font-mono font-medium text-[#1F2022]">
            <span className="text-[#94908C]">ID:</span>
            <span className="truncate max-w-[150px] sm:max-w-none">{product.id}</span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <EditProductForm product={product} />
    </div>
  );
}
