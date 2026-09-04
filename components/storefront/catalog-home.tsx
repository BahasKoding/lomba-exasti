// SmartCap Storefront Catalog Home UI
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Check } from "lucide-react";

import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { fetchCatalog, type CatalogProduct } from "@/lib/public-catalog";

const defaultCollectionsData = [
  {
    id: "c1",
    name: "Urban Baseball Cap",
    slug: "urban-baseball-cap",
    subtext: "Cotton Twill",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "c2",
    name: "Classic Bucket Hat",
    slug: "classic-bucket-hat",
    subtext: "Waterproof Canvas",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "c3",
    name: "Vintage Snapback",
    slug: "vintage-snapback",
    subtext: "Corduroy Blend",
    image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "c4",
    name: "Minimalist Beanie",
    slug: "minimalist-beanie",
    subtext: "Soft Wool Knitted",
    image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "c5",
    name: "Trucker Mesh Cap",
    slug: "trucker-mesh-cap",
    subtext: "Breathable Mesh",
    image: "https://images.unsplash.com/photo-1517423568366-8b98471794e0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "c6",
    name: "Streetwear Dad Hat",
    slug: "streetwear-dad-hat",
    subtext: "Washed Denim",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80",
  },
];

const defaultTallCollection = {
  id: "c7",
  name: "Signature Edition Cap",
  slug: "signature-edition-cap",
  subtext: "Limited Release SKU",
  image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=100",
};

export function CatalogHome() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [storeSettings, setStoreSettings] = useState({
    whatsappNumber: "6281234567890",
    inquiryTemplate: "Hello SmartCap Studio, I would like to inquire about..",
    storeName: "SmartCap Studio",
    tagline: "Crown Your Individuality",
  });

  useEffect(() => {
    fetchCatalog()
      .then((data) => setProducts(data))
      .catch(() => {});

    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("smartcap_store_settings");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setStoreSettings((prev) => ({ ...prev, ...parsed }));
        } catch (e) {}
      }
    }
  }, []);

  const displayCollections = useMemo(() => {
    if (products.length > 0) {
      return products.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        subtext: item.material || item.category || "SmartCap Collection",
        image: item.imageUrl,
      }));
    }
    return defaultCollectionsData;
  }, [products]);

  const displayTall = useMemo(() => {
    if (products.length > 6) {
      const item = products[6];
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        subtext: item.material || item.category || "Limited Release SKU",
        image: item.imageUrl,
      };
    }
    return defaultTallCollection;
  }, [products]);

  // Static Hero Image - Independent of admin products
  const heroImage = "/Model-Dashboard.png";

  const handleAddToCart = (
    e: React.MouseEvent,
    item: { id: string; name: string; slug: string; image?: string; subtext?: string }
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];
      cart.push({
        id: item.id || `item-${Date.now()}`,
        name: item.name,
        slug: item.slug,
        price: 150000,
        imageUrl: item.image || "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
        color: "Black",
        quantity: 1,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {}

    setAddedId(item.id);
    setToastMsg(`"${item.name}" berhasil ditambahkan ke Cart!`);

    setTimeout(() => setAddedId(null), 1200);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const getWaLink = () => {
    const rawNum = storeSettings.whatsappNumber.replace(/[^\d]/g, "");
    const cleanNum = rawNum.startsWith("62") ? rawNum : "62" + rawNum.replace(/^0+/, "");
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(storeSettings.inquiryTemplate)}`;
  };

  return (
    <StorefrontShell>
      {/* Floating Animated Toast Banner when item is added to cart */}
      {toastMsg && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 flex items-center gap-3 rounded-none border border-[#353B2D] bg-[#353B2D] px-5 py-3.5 text-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C4A265] text-[#1B1C1E]">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">{toastMsg}</span>
        </div>
      )}
      <main className="bg-transparent">
        {/* Hero Section matching wireframe (Letter Spacing 15%, Line Height 125%, Inter Black) */}
        <section className="relative w-full overflow-visible bg-transparent pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12">
          
          {/* Soft Dark Ambient Radial Shadow Glow (Spreads behind model & into gap above Collections) */}
          <div className="pointer-events-none absolute right-0 top-1/3 h-[600px] w-[600px] sm:h-[700px] sm:w-[700px] lg:h-[850px] lg:w-[850px] rounded-full bg-radial from-black/50 via-[#1B1C1E]/20 to-transparent blur-3xl opacity-80 z-0" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid items-start gap-12 lg:grid-cols-12">
              
              {/* Left Content Block (Cols 1-7) */}
              <div className="flex flex-col items-start lg:col-span-7 z-10 pr-0 lg:pr-6 pt-4 lg:pt-12">
                <h1 className="font-sans text-5xl font-black uppercase leading-[1.25] tracking-[0.15em] text-[#1B1C1E] sm:text-6xl lg:text-[4.25rem]">
                  {storeSettings.tagline || "CROWN YOUR INDIVIDUALITY."}
                </h1>
                
                <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-[#1B1C1E]/80 sm:text-lg">
                  Curated from the finest materials, our collection blends timeless sophistication with modern edge for the discerning wearer.
                </p>

                {/* Action Buttons Row */}
                <div className="mt-10 flex flex-wrap items-center gap-8">
                  {/* Discover More Button */}
                  <Link
                    href="/katalog"
                    className="inline-flex items-center justify-center rounded-none bg-[#353B2D] px-9 py-4 text-sm font-extrabold text-white shadow-xl transition-all duration-300 hover:scale-[1.03] hover:bg-[#C4A265] hover:shadow-2xl"
                  >
                    Discover More
                  </Link>
                  
                  {/* Inquire on WhatsApp Link */}
                  <a
                    href={getWaLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-sm font-extrabold text-[#1B1C1E] transition-colors hover:text-[#C4A265]"
                  >
                    Inquire on WhatsApp
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>

              {/* Right Spacer for Desktop Grid (Cols 8-12) */}
              <div className="hidden lg:block lg:col-span-5 h-full min-h-[720px]" />
            </div>
          </div>

          {/* Right Model Image Container (Flush right, tall & long downwards matching wireframe, CRAFT MEETS IDENTITY banner directly under photo) */}
          <div className="relative group lg:absolute lg:right-0 lg:top-0 lg:w-[48%] xl:w-[46%] w-full z-10 flex flex-col items-end justify-start mt-8 lg:mt-0">
            {/* Model Image - Sharp, Clean & Extended Long Downwards */}
            <div className="relative w-full h-[520px] sm:h-[660px] lg:h-[780px] xl:h-[860px] overflow-hidden flex items-end justify-end">
              <img
                src={heroImage}
                alt="SmartCap Hero Showcase"
                className="h-full w-full object-cover object-top lg:object-right-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            {/* CRAFT MEETS IDENTITY Banner - Font Akira Expanded & Letter Spacing 45% (0.45em) */}
            <div className="w-full bg-[#1B1C1E] px-6 sm:px-10 py-4 sm:py-5 shadow-2xl border-t border-[#353B2D] text-center z-30">
              <span
                className="text-xs sm:text-sm lg:text-base font-black uppercase text-white tracking-[0.50em]"
                style={{
                  fontFamily: "'Akira Expanded', 'Impact', 'Arial Black', sans-serif",
                  letterSpacing: "0.40em",
                }}
              >
                CRAFT MEETS IDENTITY
              </span>
            </div>
          </div>
        </section>

        {/* GAP SPACING BETWEEN HERO AND COLLECTIONS SECTION */}
        <div className="h-12 sm:h-20 lg:h-28" />

        {/* COLLECTIONS Section matching wireframe layout */}
        <section id="collections" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <h2 className="mb-6 font-sans text-3xl font-extrabold uppercase tracking-widest text-[#1B1C1E] sm:text-4xl">
            COLLECTIONS
          </h2>

          <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 items-stretch">
            {/* First 3 Cards (Row 1, Cols 1-3) */}
            {displayCollections.slice(0, 3).map((item) => (
              <Link key={item.id} href={`/produk/${item.slug}`} className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1">
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
                    onClick={(e) => handleAddToCart(e, item)}
                    className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                      addedId === item.id
                        ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-md"
                        : "border-[#353B2D] text-[#353B2D] hover:bg-[#353B2D] hover:text-white hover:scale-110 shadow-xs"
                    }`}
                  >
                    {addedId === item.id ? (
                      <Check className="h-4 w-4 stroke-[3] animate-in zoom-in-50 duration-200" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Link>
            ))}

            {/* Tall Vertical Card (Col 4, Spans Row 1 & 2) */}
            <div className="group flex flex-col justify-between cursor-pointer col-span-2 md:col-span-1 lg:col-start-4 lg:row-span-2 lg:row-start-1 h-full transition-all duration-300 hover:-translate-y-1">
              <Link href={`/produk/${displayTall.slug}`} className="flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden rounded-none bg-transparent w-full min-h-[220px] sm:min-h-[300px] lg:min-h-[460px] transition-all duration-300">
                  <img
                    src={displayTall.image}
                    alt={displayTall.name}
                    className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                </div>
                <div className="mt-3.5 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E] group-hover:text-[#C4A265] group-hover:underline">
                      {displayTall.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-[#6E7068]">{displayTall.subtext}</p>
                  </div>
                  {/* Plus (+) Button triggers Add to Cart with Micro-Animation */}
                  <button
                    type="button"
                    aria-label="Add to Cart"
                    onClick={(e) => handleAddToCart(e, displayTall)}
                    className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                      addedId === displayTall.id
                        ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-md"
                        : "border-[#353B2D] text-[#353B2D] hover:bg-[#353B2D] hover:text-white hover:scale-110 shadow-xs"
                    }`}
                  >
                    {addedId === displayTall.id ? (
                      <Check className="h-4 w-4 stroke-[3] animate-in zoom-in-50 duration-200" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Link>

              {/* View Catalog Link on Bottom Right under Col 4 matching wireframe */}
              <div className="mt-4 flex justify-end">
                <Link
                  href="/katalog"
                  className="group inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-widest text-[#1B1C1E] transition hover:text-[#C4A265]"
                >
                  View Catalog
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            {/* Next 3 Cards (Row 2, Cols 1-3) */}
            {displayCollections.slice(3, 6).map((item) => (
              <Link key={item.id} href={`/produk/${item.slug}`} className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="overflow-hidden rounded-none bg-transparent transition-all duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-square w-full object-contain transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                </div>
                <div className="mt-3.5 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E] group-hover:text-[#C4A265] group-hover:underline">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#6E7068]">{item.subtext}</p>
                  </div>
                  {/* Plus (+) Button triggers Add to Cart with Micro-Animation */}
                  <button
                    type="button"
                    aria-label="Add to Cart"
                    onClick={(e) => handleAddToCart(e, item)}
                    className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                      addedId === item.id
                        ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-md"
                        : "border-[#353B2D] text-[#353B2D] hover:bg-[#353B2D] hover:text-white hover:scale-110 shadow-xs"
                    }`}
                  >
                    {addedId === item.id ? (
                      <Check className="h-4 w-4 stroke-[3] animate-in zoom-in-50 duration-200" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US Section - Matching Wireframe 100% */}
        <section id="about" className="relative w-full overflow-visible bg-transparent py-16 sm:py-24 lg:py-32">
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid items-center gap-12 lg:grid-cols-12 min-h-[500px] sm:min-h-[640px] lg:min-h-[780px]">
              
              {/* Left Column Spacer for Desktop Absolute Model Image (Cols 1-6) */}
              <div className="hidden lg:block lg:col-span-6 h-full" />

              {/* Right Column: Text Content (Cols 7-12) */}
              <div className="flex flex-col justify-center lg:col-span-6 lg:pl-8 z-20">
                
                {/* Section Subtitle */}
                <span className="font-sans text-sm sm:text-base font-extrabold uppercase tracking-[0.25em] text-[#1B1C1E]">
                  WHY CHOOSE US
                </span>

                {/* Main Heading */}
                <h2 className="mt-4 font-sans text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#1B1C1E] leading-tight">
                  The Mark of Distinction
                </h2>

                {/* Intro Paragraph */}
                <p className="mt-5 text-sm sm:text-base font-semibold leading-relaxed text-[#1B1C1E]/80 max-w-xl">
                  Crafted with uncompromising precision to elevate your everyday silhouette and define your signature presence.
                </p>

                {/* Feature 1 */}
                <div className="mt-10 sm:mt-12 space-y-2">
                  <h3 className="font-sans text-lg sm:text-xl font-extrabold text-[#1B1C1E] tracking-wide">
                    Uncompromising Craftsmanship
                  </h3>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#6E7068] max-w-lg">
                    Sourced from the finest materials to elevate your everyday silhouette with enduring structure and luxury.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="mt-8 sm:mt-10 space-y-2">
                  <h3 className="font-sans text-lg sm:text-xl font-extrabold text-[#1B1C1E] tracking-wide">
                    Signature Quality
                  </h3>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#6E7068] max-w-lg">
                    Immaculately crafted to define your presence and stand out in any private circle.
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* Left Model Image Container - Flush Left, Tall & Full-Height Matching Desktop Wireframe Scheme */}
          <div className="relative group lg:absolute lg:left-0 lg:top-0 lg:w-[48%] xl:w-[46%] w-full z-10 flex flex-col items-start justify-start mt-8 lg:mt-0">
            <div className="relative w-full h-[480px] sm:h-[620px] lg:h-[780px] xl:h-[860px] overflow-hidden flex items-end justify-start">
              <img
                src="/Model-Dashboard-2.png"
                alt="Why Choose Us Model Showcase"
                className="h-full w-full object-cover object-top lg:object-left-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

        </section>

          {/* Bottom WhatsApp CTA Section - Styled with Olive #353B2D & Khaki #C4A265 */}
          <div className="mt-24 sm:mt-32">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-none border border-[#353B2D] bg-[#353B2D] p-8 sm:p-12 text-center text-white shadow-xl transition-all duration-500 hover:shadow-2xl">
              {/* Ambient Glow accents */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-none bg-[#C4A265]/20 blur-3xl" />
              <div className="pointer-events-none absolute -left-12 -bottom-12 h-56 w-56 rounded-none bg-white/10 blur-3xl" />

              <h3 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                Have a Vision? Let’s Talk!
              </h3>
              
              <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base font-semibold leading-relaxed text-white/90">
                Whether you're curating a private collection or require custom community pieces, our concierge team is at your disposal.
              </p>

              <div className="mt-8 flex justify-center">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20SmartCap%20Studio%2C%20saya%20ingin%20berdiskusi%20mengenai%20custom%20koleksi%20topi."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-none bg-[#C4A265] px-9 py-4 text-sm font-extrabold text-[#1B1C1E] shadow-lg transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-xl"
                >
                  Start WhatsApp Conversation
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </main>
      </StorefrontShell>
    );
  }
