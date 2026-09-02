import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buildOrderWhatsAppUrl, formatPrice, type CatalogProduct } from "@/lib/public-catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const inStock = product.stockCount > 0;

  return (
    <Card className="group overflow-hidden rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link href={`/produk/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-[#F3F1ED]">
          <img src={product.imageUrl} alt={product.name} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {product.category ? (
              <Badge variant="outline" className="rounded-full border-[#E5E2DC] bg-[#FCFAF7]/90 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#1F2022] backdrop-blur-xs">
                {product.category}
              </Badge>
            ) : null}
            <Badge variant="outline" className="rounded-full border-[#E5E2DC] bg-[#FCFAF7]/90 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#1F2022] backdrop-blur-xs">
              {inStock ? "Ready stock" : "Habis"}
            </Badge>
          </div>
        </div>

        <CardHeader className="px-5 pb-2 pt-5">
          <CardTitle className="text-xl font-black tracking-tight text-[#1F2022]">{product.name}</CardTitle>
        </CardHeader>

        <CardContent className="px-5 pb-4">
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#94908C]">{product.description || "Deskripsi produk akan tampil setelah hasil AI disimpan."}</p>
          <div className="flex items-center justify-between border-t border-[#E5E2DC] pt-3.5">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#94908C]">{product.material ? "Material" : "Stok"}</p>
              <p className="mt-0.5 text-xs font-bold text-[#1F2022]">{product.material ?? `${product.stockCount} pcs`}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-[#94908C]">Harga</p>
              <p className="mt-0.5 text-lg font-black text-[#1F2022]">{formatPrice(product.price)}</p>
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex gap-2.5 px-5 pb-5 pt-0">
        <Link href={`/produk/${product.slug}`} className={buttonVariants({ variant: "outline", className: "flex-1 rounded-full border-[#E5E2DC] text-xs font-semibold text-[#1F2022] hover:bg-[#F3F1ED]" })}>
          Detail
        </Link>
        <a
          className={buttonVariants({ variant: "default", className: "flex-1 gap-2 rounded-full bg-[#1F2022] text-xs font-semibold text-[#FCFAF7] hover:bg-[#1F2022]/90" })}
          href={buildOrderWhatsAppUrl(product)}
          target="_blank"
          rel="noreferrer"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Beli
        </a>
      </CardFooter>
    </Card>
  );
}
