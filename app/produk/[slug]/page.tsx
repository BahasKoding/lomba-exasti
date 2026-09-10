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
    } catch (err) {}

    setIsMainCartAdded(true);
    setToastMsg(`"${name}" (${colorOptions[selectedColorIndex].name}) ditambahkan ke Cart!`);

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
    } catch (err) {}

    setAddedId(item.slug);
    setToastMsg(`"${item.name}" berhasil ditambahkan ke Cart!`);

    setTimeout(() => setAddedId(null), 1200);
    setTimeout(() => setToastMsg(null), 2800);
  };

  if (loading) {
    return (
      <StorefrontShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader className="h-8 w-8 animate-spin text-[#353B2D]" />
          <p className="text-sm font-semibold text-[#6E7068]">Memuat detail produk...</p>
        </div>
      </StorefrontShell>
    );
  }

  if (!dbMatch) {
    return (
      <StorefrontShell>
        <main className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-black text-[#1B1C1E]">Produk Tidak Ditemukan</h1>
          <p className="text-sm text-[#6E7068]">Produk yang Anda cari tidak tersedia dalam katalog kami.</p>
          <div className="pt-4">
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 rounded-none bg-[#353B2D] px-6 py-3 text-xs font-bold text-white uppercase tracking-wider transition hover:bg-[#C4A265] hover:text-[#1B1C1E]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Katalog</span>
            </Link>
          </div>
        </main>
      </StorefrontShell>
    );
  }

  return (
    <StorefrontShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Back Button matching new wireframe (Clean Left Arrow) */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Kembali"
            className="group flex items-center gap-2 text-[#1F2022] transition hover:opacity-75"
          >
            <ArrowLeft className="h-7 w-7 stroke-[2.5] transition-transform duration-300 group-hover:-translate-x-1" />
          </button>
        </div>

        {/* Main Product Section matching new wireframe */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-start">
          {/* Left Media Block (Col 1-7): Thumbnails stacked vertically on the left of Main Image */}
          <div className="lg:col-span-7 flex flex-row gap-4 sm:gap-6 items-start">
            {/* 3 Vertical Thumbnails - Clean Grey/Khaki Border, No Black Outline */}
            <div className="flex flex-col gap-3 shrink-0">
              {images.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-none bg-transparent transition-all duration-300 cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-2 border-[#C4A265] opacity-100 scale-[1.02]"
                      : "border border-[#DED9CF] opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Photo Showcase - Clean No-Border for PNG caps */}
            <div className="flex-1 aspect-square w-full overflow-hidden rounded-none bg-transparent transition-all duration-300">
              <img src={currentMainImage} alt={name} className="h-full w-full object-contain p-2 transition-all duration-500 hover:scale-105" />
            </div>
          </div>

          {/* Right Product Info & Controls Column (Col 8-12) */}
          <div className="flex flex-col lg:col-span-5">
            <h1 className="font-sans text-3xl font-black uppercase tracking-wider text-[#1B1C1E] sm:text-4xl">
              {name}
            </h1>

            <p className="mt-2 text-2xl font-black text-[#353B2D]">
              {formatPrice(price)}
            </p>

            {/* AI Generated Description from Database */}
            <div className="mt-6">
              <p className="text-sm font-medium leading-relaxed text-[#1B1C1E]/80">
                {description}
              </p>
            </div>

            {/* Color Swatches - Clean Grey/Khaki Border, No Black Outline */}
            <div className="mt-8">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#1B1C1E]">Color</p>
              <div className="mt-3 flex items-center gap-3">
                {colorOptions.map((col, idx) => (
                  <button
                    key={col.name}
                    type="button"
                    title={col.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    style={{ backgroundColor: col.hex }}
                    className={`h-9 w-9 rounded-full transition-all duration-200 cursor-pointer ${
                      selectedColorIndex === idx
                        ? "border-2 border-[#C4A265] ring-2 ring-[#DED9CF] scale-110 shadow-xs"
                        : "border border-[#DED9CF] opacity-80 hover:opacity-100 hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Stepper Quantity & Action Buttons */}
            <div className="mt-8 space-y-6">
              {/* Stepper */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-none border border-[#353B2D] text-[#353B2D] transition-all duration-300 hover:bg-[#353B2D] hover:text-white hover:scale-110"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-2 text-base font-bold text-[#1B1C1E]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-none border border-[#353B2D] text-[#353B2D] transition-all duration-300 hover:bg-[#353B2D] hover:text-white hover:scale-110"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Order & Cart Buttons matching new wireframe */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    `Halo SmartCap Studio, saya ingin memesan:\n\n- Produk: ${name}\n- Warna: ${colorOptions[selectedColorIndex].name}\n- Jumlah: ${quantity} pcs\n- Total: ${formatPrice(price * quantity)}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-none bg-[#353B2D] py-4 text-center text-base font-extrabold text-white shadow-xs transition-all duration-300 hover:bg-[#C4A265] hover:text-[#1B1C1E]"
                >
                  Order
                </a>
                <button
                  type="button"
                  onClick={handleAddToCartDetail}
                  className={`rounded-none border transition-all duration-300 px-8 py-4 text-base font-extrabold shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                    isMainCartAdded
                      ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-105 shadow-md"
                      : "border-[#353B2D] bg-white text-[#353B2D] hover:bg-[#353B2D] hover:text-white"
                  }`}
                >
                  {isMainCartAdded ? (
                    <>
                      <Check className="h-5 w-5 stroke-[3] animate-in zoom-in-50 duration-200" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <span>Cart</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <hr className="my-14 border-[#E5E2DC]" />

        {/* Related Products Section: "You May Also Like" matching new wireframe (4 Cards + Arrow) */}
        <section className="mb-12">
          <h2 className="mb-6 font-sans text-lg font-bold tracking-wide text-[#1B1C1E] sm:text-xl">
            You May Also Like
          </h2>

          <div className="flex items-center gap-6">
            <div className="grid flex-1 grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-4">
              {displayRelatedItems.map((item) => (
                <Link key={item.slug} href={`/produk/${item.slug}`} className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1">
                  <div className="overflow-hidden rounded-none bg-transparent transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="aspect-square w-full object-contain transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                  </div>
                  <div className="mt-3.5 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E] group-hover:text-[#C4A265] group-hover:underline">
                        {item.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] sm:text-xs text-[#6E7068]">{item.subtext}</p>
                    </div>
                    {/* Plus (+) Button triggers Add to Cart with Micro-Animation */}
                    <button
                      type="button"
                      aria-label="Add to Cart"
                      onClick={(e) => handleAddToCartRelated(e, item)}
                      className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                        addedId === item.slug
                          ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-md"
                          : "border-[#353B2D] text-[#353B2D] hover:bg-[#353B2D] hover:text-white hover:scale-110 shadow-xs"
                      }`}
                    >
                      {addedId === item.slug ? (
                        <Check className="h-3.5 w-3.5 stroke-[3] animate-in zoom-in-50 duration-200" />
                      ) : (
                        <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      )}
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Side Arrow Button (Directs to /katalog page) */}
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
