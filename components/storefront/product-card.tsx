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
      const cart: any[] = raw ? JSON.parse(raw) : [];
      const existingIdx = cart.findIndex(
        (item: any) => item.id === product.id || item.slug === product.slug
      );
      if (existingIdx > -1) {
        cart[existingIdx].quantity = (Number(cart[existingIdx].quantity) || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
          color: "Black",
          quantity: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {}

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

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

      {/* Card Info: Product Name, Price Below Product Name & Plus (+) Cart Button */}
      <div className="mt-3.5 flex items-start justify-between gap-2 px-1">
        <div className="flex-1 min-w-0">
          {/* Product Name */}
          <h3 className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase tracking-tight sm:tracking-wider text-[#1B1C1E] leading-snug group-hover:text-[#C4A265] group-hover:underline break-words">
            {product.name}
          </h3>
          
          {/* Price (Below Product Name) */}
          <p className="mt-0.5 text-[10px] sm:text-xs md:text-sm font-black text-[#353B2D]">
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


