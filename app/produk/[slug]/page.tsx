"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Minus, Plus, Check, Loader } from "lucide-react";

import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { buildOrderWhatsAppUrl, fetchCatalog, formatPrice, type CatalogProduct } from "@/lib/public-catalog";

const colorOptions = [
  { name: "Default", hex: "#D9D9D9" },
  { name: "Charcoal", hex: "#1F2022" },
  { name: "Cream", hex: "#E5E2DC" },
  { name: "Warm Gray", hex: "#94908C" },
  { name: "Navy", hex: "#4A4E69" },
];

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  const rawSlug = params?.slug;
  const slugStr = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string | undefined);
  const slug = decodeURIComponent(slugStr || "").toLowerCase().trim();

  const [dbProducts, setDbProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [waNumber, setWaNumber] = useState("6281234567890");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchCatalog()
      .then((data) => setDbProducts(data || []))
      .catch(() => setDbProducts([]))
      .finally(() => setLoading(false));

    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("smartcap_store_settings");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.whatsappNumber) {
            const rawNum = parsed.whatsappNumber.replace(/[^\d]/g, "");
            const cleanNum = rawNum.startsWith("62") ? rawNum : "62" + rawNum.replace(/^0+/, "");
            setWaNumber(cleanNum);
          }
        } catch (e) {}
      }
    }
  }, []);

  const dbMatch = dbProducts.find(
    (p) => p.slug.toLowerCase() === slug || p.name.toLowerCase().replace(/\s+/g, "-") === slug
  );

  const name = dbMatch?.name || "";
  const price = dbMatch?.price || 0;
  const description = dbMatch?.description || "";
  const images = dbMatch?.imageUrl ? [dbMatch.imageUrl] : [];

  const currentMainImage = images[selectedImageIndex] ?? images[0] ?? "";

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Halo SmartCap Studio, saya ingin memesan:\n\n- Produk: ${name}\n- Warna: ${colorOptions[selectedColorIndex].name}\n- Jumlah: ${quantity} pcs\n- Total: ${formatPrice(price * quantity)}`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  const displayRelatedItems = useMemo(() => {
    const others = dbProducts.filter(
      (p) => p.slug.toLowerCase() !== slug && p.name.toLowerCase().replace(/\s+/g, "-") !== slug
    );
    return others.slice(0, 4).map((item) => ({
      name: item.name,
      slug: item.slug,
      subtext: item.material || item.category || "SmartCap Collection",
      image: item.imageUrl,
    }));
  }, [dbProducts, slug]);

  const [isMainCartAdded, setIsMainCartAdded] = useState(false);

  const handleAddToCartDetail = () => {
    try {
      const raw = localStorage.getItem("cart");
      const cart: any[] = raw ? JSON.parse(raw) : [];
      const itemId = dbMatch?.id || `item-${slug}`;
      const selectedColor = colorOptions[selectedColorIndex].name;
      const existingIdx = cart.findIndex(
        (item: any) => (item.slug === slug || item.id === itemId) && item.color === selectedColor
      );
      if (existingIdx > -1) {
        cart[existingIdx].quantity = (Number(cart[existingIdx].quantity) || 1) + quantity;
      } else {
        cart.push({
          id: itemId,
          name: name,
          slug: slug,
          price: price,
          imageUrl: currentMainImage,
          color: selectedColor,
          quantity: quantity,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {}

    setIsMainCartAdded(true);
    setToastMsg(`"${name}" (${colorOptions[selectedColorIndex].name}) added to Cart!`);

    setTimeout(() => setIsMainCartAdded(false), 1600);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddToCartRelated = (
    e: React.MouseEvent,
    item: { name: string; slug: string; image: string }
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const raw = localStorage.getItem("cart");
      const cart: any[] = raw ? JSON.parse(raw) : [];
      const existingIdx = cart.findIndex(
        (cItem: any) => cItem.slug === item.slug
      );
      if (existingIdx > -1) {
        cart[existingIdx].quantity = (Number(cart[existingIdx].quantity) || 1) + 1;
      } else {
        cart.push({
          id: `item-${item.slug}`,
          name: item.name,
          slug: item.slug,
          price: 149000,
          imageUrl: item.image,
          color: "Black",
          quantity: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {}

    setAddedId(item.slug);
    setToastMsg(`"${item.name}" added to Cart!`);

    setTimeout(() => setAddedId(null), 1200);
    setTimeout(() => setToastMsg(null), 2800);
  };

  if (loading) {
    return (
      <StorefrontShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader className="h-8 w-8 animate-spin text-[#353B2D]" />
          <p className="text-sm font-semibold text-[#6E7068]">Loading product details...</p>
        </div>
      </StorefrontShell>
    );
  }

  if (!dbMatch) {
    return (
      <StorefrontShell>
        <main className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-black text-[#1B1C1E]">Product Not Found</h1>
          <p className="text-sm text-[#6E7068]">The product you are looking for is not available in our catalog.</p>
          <div className="pt-4">
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 rounded-none bg-[#353B2D] px-6 py-3 text-xs font-bold text-white uppercase tracking-wider transition hover:bg-[#C4A265] hover:text-[#1B1C1E]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Catalog</span>
            </Link>
          </div>
        </main>
      </StorefrontShell>
    );
  }

  return (
    <StorefrontShell>
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 flex items-center gap-3 rounded-none border border-[#353B2D] bg-[#353B2D] px-5 py-3.5 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex h-7 w-7 items-center justify-center rounded-none bg-[#C4A265] text-[#1B1C1E]">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">{toastMsg}</span>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-10">
        {/* Back Navigation Bar */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1F2022] transition hover:opacity-75 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 sm:h-6 sm:w-6 stroke-[2.5] transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back</span>
          </button>
          <span className="text-[11px] sm:text-xs font-bold text-[#6E7068] uppercase tracking-wider truncate max-w-[180px] sm:max-w-none">
            Catalog / {name}
          </span>
        </div>

        {/* Main Product Showcase Section - Optimized Mobile & Desktop */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10 items-start">
          
          {/* Left Media Block (Col 1-7): Clean Transparent PNG Showcase */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 sm:gap-6 items-center md:items-start w-full">
            
            {/* Main Image Container - Transparent PNG without white background */}
            <div className="order-1 md:order-2 flex-1 aspect-square w-full max-w-[340px] sm:max-w-full overflow-hidden bg-transparent transition-all duration-300 flex items-center justify-center p-2 sm:p-4">
              <img
                src={currentMainImage}
                alt={name}
                className="h-full w-full object-contain filter drop-shadow-md transition-all duration-500 hover:scale-105"
              />
            </div>

            {/* Thumbnails Row: Transparent backgrounds, horizontal on mobile */}
            <div className="order-2 md:order-1 flex flex-row md:flex-col gap-2.5 shrink-0 overflow-x-auto w-full md:w-auto py-1 md:py-0 no-scrollbar justify-center md:justify-start">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square h-14 w-14 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-none bg-transparent transition-all duration-300 cursor-pointer flex items-center justify-center ${
                    selectedImageIndex === idx
                      ? "border-2 border-[#C4A265] ring-2 ring-[#C4A265]/30 opacity-100 scale-105"
                      : "border border-[#353B2D]/15 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Info & Controls Column (Col 8-12) */}
          <div className="flex flex-col lg:col-span-5">
            <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider text-[#1B1C1E]">
              {name}
            </h1>

            <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black text-[#353B2D]">
              {formatPrice(price)}
            </p>

            {/* Description Box - Minimalist border, transparent backdrop */}
            <div className="mt-4 bg-[#353B2D]/5 p-3.5 sm:p-4 rounded-none border border-[#353B2D]/10">
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#1B1C1E]/80">
                {description || "Curated from premium materials for lasting quality and timeless style."}
              </p>
            </div>

            {/* Color Swatch Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-wider text-[#1B1C1E]">
                  Color: <span className="text-[#353B2D] font-extrabold">{colorOptions[selectedColorIndex].name}</span>
                </p>
              </div>
              <div className="mt-2.5 flex items-center gap-3">
                {colorOptions.map((col, idx) => (
                  <button
                    key={col.name}
                    type="button"
                    title={col.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    style={{ backgroundColor: col.hex }}
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-none transition-all duration-200 cursor-pointer ${
                      selectedColorIndex === idx
                        ? "border-2 border-[#C4A265] ring-2 ring-[#C4A265]/40 scale-110 shadow-sm"
                        : "border border-[#DED9CF] opacity-80 hover:opacity-100 hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Action Buttons */}
            <div className="mt-5 space-y-4">
              {/* Stepper Quantity Control */}
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#1B1C1E] mb-2">
                  Quantity
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-[#353B2D] text-[#353B2D] transition-all duration-300 hover:bg-[#353B2D] hover:text-white cursor-pointer active:scale-95"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 text-base font-black text-[#1B1C1E] min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none border border-[#353B2D] text-[#353B2D] transition-all duration-300 hover:bg-[#353B2D] hover:text-white cursor-pointer active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Order & Cart Action Buttons Row - Tailored for Mobile Touch */}
              <div className="flex flex-row items-center gap-2.5 pt-1">
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    `Halo SmartCap Studio, saya ingin memesan:\n\n- Produk: ${name}\n- Warna: ${colorOptions[selectedColorIndex].name}\n- Jumlah: ${quantity} pcs\n- Total: ${formatPrice(price * quantity)}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-none bg-[#353B2D] py-3.5 sm:py-4 text-center text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#C4A265] hover:text-[#1B1C1E] active:scale-95 cursor-pointer"
                >
                  Order on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleAddToCartDetail}
                  className={`rounded-none border transition-all duration-300 px-4 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                    isMainCartAdded
                      ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-105 shadow-md"
                      : "border-[#353B2D] bg-transparent text-[#353B2D] hover:bg-[#353B2D] hover:text-white"
                  }`}
                >
                  {isMainCartAdded ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3] animate-in zoom-in-50 duration-200" />
                      <span>Added</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <hr className="my-8 sm:my-14 border-[#353B2D]/15" />

        {/* Related Products Section: "You May Also Like" - PNG Transparent Cards */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-sans text-base sm:text-xl font-extrabold uppercase tracking-widest text-[#1B1C1E]">
              You May Also Like
            </h2>
            <Link
              href="/katalog"
              className="text-xs font-bold uppercase tracking-wider text-[#353B2D] hover:text-[#C4A265] transition"
            >
              View All
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="grid flex-1 grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {displayRelatedItems.map((item) => (
                <Link key={item.slug} href={`/produk/${item.slug}`} className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1">
                  <div className="overflow-hidden bg-transparent p-2 transition-all duration-300 flex items-center justify-center aspect-square">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="aspect-square w-full object-contain filter drop-shadow-xs transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                  </div>
                  <div className="mt-2 flex items-start justify-between gap-1.5">
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E] group-hover:text-[#C4A265] group-hover:underline line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="mt-0.5 text-[10px] sm:text-xs text-[#6E7068]">{item.subtext}</p>
                    </div>
                    {/* Plus (+) Button triggers Add to Cart */}
                    <button
                      type="button"
                      aria-label="Add to Cart"
                      onClick={(e) => handleAddToCartRelated(e, item)}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                        addedId === item.slug
                          ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-md"
                          : "border-[#353B2D]/25 text-[#353B2D] hover:bg-[#353B2D] hover:text-white hover:scale-110 shadow-xs"
                      }`}
                    >
                      {addedId === item.slug ? (
                        <Check className="h-3.5 w-3.5 stroke-[3] animate-in zoom-in-50 duration-200" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Side Arrow Button */}
            <Link
              href="/katalog"
              aria-label="Direct to Catalog"
              title="View All Catalog"
              className="hidden xl:grid h-12 w-12 shrink-0 place-items-center rounded-none bg-[#353B2D] text-white shadow-xs transition-all duration-300 hover:bg-[#C4A265] hover:text-[#1B1C1E] hover:scale-105 cursor-pointer"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}
