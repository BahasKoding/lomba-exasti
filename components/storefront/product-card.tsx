import { useState } from "react";
import Link from "next/link";
import { Plus, Check } from "lucide-react";

import { buildOrderWhatsAppUrl, formatPrice, type CatalogProduct } from "@/lib/public-catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {}

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const categoryLabel = product.category ?? product.material ?? "Topi Collection";

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >
      {/* Square Image Box (Aspect 1:1) - 0 Corner Radius, Clean No-Border for PNG caps */}
      <div className="overflow-hidden rounded-none bg-transparent transition-all duration-300">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="aspect-square w-full object-contain transition-transform duration-700 ease-out group-hover:scale-108"
        />
      </div>

      {/* Card Info: Product Name, Category Text Below Name, Price & Plus (+) Cart Button */}
      <div className="mt-3.5 flex items-start justify-between gap-2 px-1">
        <div className="flex-1 min-w-0">
          {/* Product Name */}
          <h3 className="truncate text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E] group-hover:text-[#C4A265] group-hover:underline">
            {product.name}
          </h3>
          
          {/* Category Text (Below Product Name) */}
          <p className="mt-0.5 truncate text-xs font-semibold text-[#6E7068]">
            {categoryLabel}
          </p>

          {/* Price */}
          <p className="mt-1.5 text-sm font-black text-[#353B2D]">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Plus (+) Add-to-Cart Button with Micro-Animation */}
        <button
          type="button"
          aria-label={`Tambah ${product.name} ke Keranjang`}
          onClick={handleAddToCart}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
            isAdded
              ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-md"
              : "border-[#353B2D] text-[#353B2D] hover:bg-[#353B2D] hover:text-white hover:scale-110 shadow-xs"
          }`}
          title="Tambah ke Keranjang"
        >
          {isAdded ? (
            <Check className="h-4 w-4 stroke-[3] animate-in zoom-in-50 duration-200" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>
      </div>
    </Link>
  );
}


