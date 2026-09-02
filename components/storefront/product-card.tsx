import Link from "next/link";
import { Plus } from "lucide-react";

import { buildOrderWhatsAppUrl, formatPrice, type CatalogProduct } from "@/lib/public-catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
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

    alert(`"${product.name}" telah ditambahkan ke Keranjang (Cart)!`);
  };

  const categoryLabel = product.category ?? product.material ?? "Topi Collection";

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >
      {/* Square Image Box (Aspect 1:1) with Rounded 2XL - Clean without floating badge inside */}
      <div className="overflow-hidden rounded-2xl bg-[#E5E2DC] shadow-xs transition-shadow duration-300 group-hover:shadow-md">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
      </div>

      {/* Card Info: Product Name, Category Text Below Name, Price & Plus (+) Cart Button */}
      <div className="mt-3.5 flex items-start justify-between gap-2 px-1">
        <div className="flex-1 min-w-0">
          {/* Product Name */}
          <h3 className="truncate text-sm font-extrabold uppercase tracking-wider text-[#1F2022] group-hover:underline">
            {product.name}
          </h3>
          
          {/* Category Text (Below Product Name) */}
          <p className="mt-0.5 truncate text-xs font-semibold text-[#94908C]">
            {categoryLabel}
          </p>

          {/* Price */}
          <p className="mt-1.5 text-sm font-black text-[#1F2022]">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Circular Plus (+) Add-to-Cart Button */}
        <button
          type="button"
          aria-label={`Tambah ${product.name} ke Keranjang`}
          onClick={handleAddToCart}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1F2022] text-[#1F2022] transition-all duration-300 hover:bg-[#1F2022] hover:text-[#FCFAF7] hover:scale-110 shadow-xs"
          title="Tambah ke Keranjang"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </Link>
  );
}


