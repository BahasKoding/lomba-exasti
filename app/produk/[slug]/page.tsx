"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Minus, Plus, Check } from "lucide-react";

import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { buildOrderWhatsAppUrl, fetchCatalog, formatPrice, type CatalogProduct } from "@/lib/public-catalog";

const dummyDetailCatalog: Record<string, {
  name: string;
  price: number;
  description: string;
  subtext: string;
  images: string[];
}> = {
  "urban-baseball-cap": {
    name: "Urban Baseball Cap",
    price: 149000,
    description: "Crafted from 100% premium cotton twill, featuring a classic 6-panel silhouette, embroidered eyelets for ventilation, and an adjustable metallic strapback closure for custom day-long comfort.",
    subtext: "Cotton Twill",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517423568366-8b98471794e0?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "classic-bucket-hat": {
    name: "Classic Bucket Hat",
    price: 169000,
    description: "Engineered from water-repellent canvas fabric, providing full 360-degree shade protection with a soft structured brim and breathable mesh lining.",
    subtext: "Waterproof Canvas",
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "vintage-snapback": {
    name: "Vintage Snapback",
    price: 189000,
    description: "Retro corduroy texture combined with structured crown panels and a flat brim for timeless streetwear sophistication.",
    subtext: "Corduroy Blend",
    images: [
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "minimalist-beanie": {
    name: "Minimalist Beanie",
    price: 129000,
    description: "Ultra-soft wool knit beanie offering snug elastic warmth and a clean cuffed rib design suited for minimalist aesthetics.",
    subtext: "Soft Wool Knitted",
    images: [
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "trucker-mesh-cap": {
    name: "Trucker Mesh Cap",
    price: 139000,
    description: "Classic high-crown foam front panel with breathable rear mesh netting and snap closure for effortless outdoor utility.",
    subtext: "Breathable Mesh",
    images: [
      "https://images.unsplash.com/photo-1517423568366-8b98471794e0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "streetwear-dad-hat": {
    name: "Streetwear Dad Hat",
    price: 159000,
    description: "Washed denim finish with an unconstructed low-profile fit, pre-curved visor, and antique brass buckle closure.",
    subtext: "Washed Denim",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "signature-edition-cap": {
    name: "Signature Edition Cap",
    price: 249000,
    description: "Limited release SKU crafted with custom woven patch embroidery, premium satin interior lining, and individual serial numbering.",
    subtext: "Limited Release SKU",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
    ],
  },
};

const relatedItems = [
  {
    name: "Urban Baseball Cap",
    slug: "urban-baseball-cap",
    subtext: "Cotton Twill",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Classic Bucket Hat",
    slug: "classic-bucket-hat",
    subtext: "Waterproof Canvas",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Vintage Snapback",
    slug: "vintage-snapback",
    subtext: "Corduroy Blend",
    image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=600&q=80",
  },
];

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [waNumber, setWaNumber] = useState("6281234567890");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCatalog()
      .then((data) => setDbProducts(data))
      .catch(() => {});

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
  
  const fallbackKey = Object.keys(dummyDetailCatalog).find(
    (k) => k.toLowerCase() === slug || dummyDetailCatalog[k].name.toLowerCase() === slug.replace(/-/g, " ")
  ) || "urban-baseball-cap";

  const fallbackMatch = dummyDetailCatalog[fallbackKey];

  const name = dbMatch?.name ?? fallbackMatch.name;
  const price = dbMatch?.price ?? fallbackMatch.price;
  const description = dbMatch?.description ?? fallbackMatch.description;
  const images = dbMatch?.imageUrl ? [dbMatch.imageUrl, ...fallbackMatch.images.slice(1)] : fallbackMatch.images;

  const currentMainImage = images[selectedImageIndex] ?? images[0];

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Halo SmartCap Studio, saya ingin memesan:\n\n- Produk: ${name}\n- Warna: ${colorOptions[selectedColorIndex].name}\n- Jumlah: ${quantity} pcs\n- Total: ${formatPrice(price * quantity)}`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  const displayRelatedItems = useMemo(() => {
    if (dbProducts.length > 1) {
      const others = dbProducts.filter(
        (p) => p.slug.toLowerCase() !== slug && p.name.toLowerCase().replace(/\s+/g, "-") !== slug
      );
      if (others.length > 0) {
        return others.slice(0, 4).map((item) => ({
          name: item.name,
          slug: item.slug,
          subtext: item.material || item.category || "SmartCap Collection",
          image: item.imageUrl,
        }));
      }
    }
    return relatedItems.slice(0, 4);
  }, [dbProducts, slug]);

  const [isMainCartAdded, setIsMainCartAdded] = useState(false);

  const handleAddToCartDetail = () => {
    try {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];
      cart.push({
        id: dbMatch?.id || `item-${Date.now()}`,
        name: name,
        slug: slug,
        price: price,
        imageUrl: currentMainImage,
        color: colorOptions[selectedColorIndex].name,
        quantity: quantity,
      });
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
      const cart = raw ? JSON.parse(raw) : [];
      cart.push({
        id: `item-${Date.now()}`,
        name: item.name,
        slug: item.slug,
        price: 149000,
        imageUrl: item.image,
        color: "Black",
        quantity: 1,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {}

    setAddedId(item.slug);
    setToastMsg(`"${item.name}" berhasil ditambahkan ke Cart!`);

    setTimeout(() => setAddedId(null), 1200);
    setTimeout(() => setToastMsg(null), 2800);
  };

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
