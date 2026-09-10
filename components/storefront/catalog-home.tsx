// SmartCap Storefront Catalog Home UI
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Check } from "lucide-react";

import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { fetchCatalog, type CatalogProduct } from "@/lib/public-catalog";

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
      .then((data) => setProducts(data || []))
      .catch(() => setProducts([]));

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
    return products.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      subtext: item.material || item.category || "SmartCap Collection",
      image: item.imageUrl,
    }));
  }, [products]);

  const desktopCollections = useMemo(() => {
    const list = [...displayCollections];
    const fallbacks = [
      { id: "fallback-1", name: "CHRONO TACTICAL CAP", slug: "chrono-tactical-cap", subtext: "100% Heavy Cotton Canvas", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80" },
      { id: "fallback-2", name: "AURA EMBROIDERED BEANIE", slug: "aura-embroidered-beanie", subtext: "Wool Blend Knit", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=600&q=80" },
      { id: "fallback-3", name: "VELOCITY SNAPBACK", slug: "velocity-snapback", subtext: "Water-Resistant Nylon", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80" },
      { id: "fallback-4", name: "ONYX BUCKET HAT", slug: "onyx-bucket-hat", subtext: "Premium Brushed Cotton", image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=600&q=80" },
      { id: "fallback-5", name: "MINIMALIST DAD HAT", slug: "minimalist-dad-hat", subtext: "Unstructured Low Profile", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80" },
      { id: "fallback-6", name: "STEALTH VISOR CAP", slug: "stealth-visor-cap", subtext: "Performance Mesh Blend", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80" },
    ];
    let idx = 0;
    while (list.length < 6) {
      list.push(fallbacks[idx % fallbacks.length]);
      idx++;
    }
    return list.slice(0, 6);
  }, [displayCollections]);

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
    if (products.length > 0) {
      return {
        id: products[0].id,
        name: products[0].name,
        slug: products[0].slug,
        subtext: products[0].material || products[0].category || "Limited Release SKU",
        image: products[0].imageUrl,
      };
    }
    return null;
  }, [products]);

  const desktopTallProduct = useMemo(() => {
    if (displayTall) return displayTall;
    return {
      id: "fallback-tall",
      name: "LIMITED STATEMENT CAP",
      slug: "limited-statement-cap",
      subtext: "Signature Release",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
    };
  }, [displayTall]);

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
      const cart: any[] = raw ? JSON.parse(raw) : [];
      const targetId = item.id || `item-${item.slug}`;
      const existingIdx = cart.findIndex(
        (cItem: any) => (cItem.id && cItem.id === targetId) || cItem.slug === item.slug
      );
      if (existingIdx > -1) {
        cart[existingIdx].quantity = (Number(cart[existingIdx].quantity) || 1) + 1;
      } else {
        cart.push({
          id: targetId,
          name: item.name,
          slug: item.slug,
          price: 150000,
          imageUrl: item.image || "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
          color: "Black",
          quantity: 1,
        });
      }
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
        {/* Hero Section matching wireframe (Desktop: Original Bold Inter Black, Mobile: Inter Medium 2-line layout) */}
        <section className="relative w-full overflow-visible bg-transparent pt-6 sm:pt-10 lg:pt-20 pb-8 sm:pb-12">
          
          {/* Soft Dark Ambient Radial Shadow Glow (Spreads behind model & into gap above Collections) */}
          <div className="pointer-events-none absolute right-0 top-1/3 h-[600px] w-[600px] sm:h-[700px] sm:w-[700px] lg:h-[850px] lg:w-[850px] rounded-full bg-radial from-black/50 via-[#1B1C1E]/20 to-transparent blur-3xl opacity-80 z-0" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid items-start gap-12 lg:grid-cols-12">
              
              {/* Left Content Block (Cols 1-7) */}
              <div className="flex flex-col items-start lg:col-span-7 z-10 pr-0 lg:pr-6 pt-2 lg:pt-12">
                
                {/* Mobile Title Layout (Font Inter Medium, 2 lines) */}
                <h1 className="lg:hidden font-sans text-4xl sm:text-5xl font-medium uppercase tracking-[0.10em] text-[#1B1C1E] leading-[1.08] space-y-1.5">
                  <span className="block font-medium leading-[1.08]">CROWN YOUR</span>
                  <span className="block font-medium leading-[1.08]">INDIVIDUALITY.</span>
                </h1>

                {/* Desktop Title Layout (Ultra Bold Font-Black 900 with Increased Line Spacing) */}
                <h1
                  className="hidden lg:block font-sans text-5xl lg:text-[4.5rem] font-black uppercase leading-[1.25] lg:leading-[1.28] tracking-[0.12em] text-[#1B1C1E] space-y-3"
                  style={{ fontWeight: 900 }}
                >
                  <span className="block font-black leading-[1.25] lg:leading-[1.28]" style={{ fontWeight: 900 }}>
                    CROWN YOUR
                  </span>
                  <span className="block font-black leading-[1.25] lg:leading-[1.28]" style={{ fontWeight: 900 }}>
                    INDIVIDUALITY.
                  </span>
                </h1>
                
                <p className="mt-6 max-w-lg text-base font-normal lg:font-medium leading-relaxed text-[#1B1C1E]/80 sm:text-lg">
                  Curated from the finest materials, our collection blends timeless sophistication with modern edge for the discerning wearer.
                </p>

                {/* Action Buttons Row */}
                <div className="mt-8 lg:mt-10 flex flex-wrap items-center gap-6 lg:gap-8">
                  {/* Discover More Button */}
                  <Link
                    href="/katalog"
                    className="inline-flex items-center justify-center rounded-none bg-[#353B2D] px-8 lg:px-9 py-3.5 lg:py-4 text-xs lg:text-sm font-bold lg:font-extrabold text-white shadow-xl transition-all duration-300 hover:scale-[1.03] hover:bg-[#C4A265] hover:text-[#1B1C1E]"
                  >
                    Discover More
                  </Link>
                  
                  {/* Inquire on WhatsApp Link */}
                  <a
                    href={getWaLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-xs lg:text-sm font-bold lg:font-extrabold text-[#1F2022] transition-colors hover:opacity-75 lg:hover:text-[#C4A265]"
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

          {/* Right Model Image Container */}
          <div className="relative group lg:absolute lg:right-0 lg:top-0 lg:w-[48%] xl:w-[46%] w-full z-10 flex flex-col items-end justify-start -mt-4 sm:-mt-8 lg:mt-0">
            {/* Model Image - Sharp, Clean & Extended Long Downwards */}
            <div className="relative w-full h-[520px] sm:h-[660px] lg:h-[780px] xl:h-[860px] overflow-hidden flex items-end justify-end">
              <img
                src={heroImage}
                alt="SmartCap Hero Showcase"
                className="h-full w-full object-cover object-top lg:object-right-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Full-Width Edge-to-Edge repeating SMARTCAP.STUDIO black bar (Touching Left & Right Screen Edges) */}
          <div className="relative z-30 w-full bg-[#1B1C1E] py-4 sm:py-5 shadow-2xl text-center overflow-hidden border-y border-[#353B2D]">
            <div className="flex items-center justify-center gap-8 sm:gap-14 text-xs sm:text-sm lg:text-base font-black uppercase text-white tracking-[0.4em] whitespace-nowrap">
              <span>SMARTCAP.STUDIO</span>
              <span>SMARTCAP.STUDIO</span>
              <span>SMARTCAP.STUDIO</span>
              <span className="hidden sm:inline">SMARTCAP.STUDIO</span>
              <span className="hidden md:inline">SMARTCAP.STUDIO</span>
            </div>
          </div>
        </section>

        {/* GAP SPACING BETWEEN HERO AND COLLECTION SECTION */}
        <div className="h-12 sm:h-20 lg:h-28" />

        {/* COLLECTION Section */}
        <section id="collections" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          
          {/* MOBILE UI (< lg) matching mobile wireframe 100% */}
          <div className="lg:hidden">
            <h2 className="mb-6 font-sans text-3xl font-extrabold uppercase tracking-widest text-[#1B1C1E] sm:text-4xl">
              COLLECTION
            </h2>

            {/* 4 Cards Grid (2x2 on Mobile) */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 items-stretch">
              {displayCollections.slice(0, 4).map((item) => (
                <div key={item.id} className="group flex flex-col justify-between transition-all duration-300">
                  <Link href={`/produk/${item.slug}`} className="flex-1 flex flex-col cursor-pointer">
                    <div className="overflow-hidden rounded-none bg-[#FCFAF7] border border-[#E5E2DC] transition-all duration-300">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="aspect-square w-full object-contain transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-2">
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
                            : "border-[#1F2022] text-[#1F2022] hover:bg-[#1F2022] hover:text-white hover:scale-110 shadow-xs"
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
                </div>
              ))}
            </div>

            {/* Full Width Featured Showcase Banner Image (Matching Mobile Wireframe) */}
            {displayTall && (
              <div className="mt-6 sm:mt-8 w-full">
                <Link href={`/produk/${displayTall.slug}`} className="group block cursor-pointer overflow-hidden rounded-none border border-[#E5E2DC] bg-[#FCFAF7]">
                  <img
                    src={displayTall.image}
                    alt={displayTall.name}
                    className="w-full aspect-square sm:aspect-video object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </Link>
              </div>
            )}

            {/* Full Width "View Catalog" Button for Mobile */}
            <div className="mt-6 sm:mt-8 w-full">
              <Link
                href="/katalog"
                className="flex w-full items-center justify-center rounded-none bg-[#353B2D] text-white py-3.5 px-6 text-xs font-extrabold uppercase tracking-widest shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                View Catalog
              </Link>
            </div>
          </div>

          {/* DESKTOP UI (>= lg) matching desktop wireframe screenshot 100% */}
          <div className="hidden lg:block">
            <h2 className="mb-8 font-sans text-4xl font-extrabold uppercase tracking-widest text-[#1B1C1E]">
              COLLECTIONS
            </h2>

            {/* Asymmetric Desktop Layout: Left 3 cols = 6 cards in 3x2 grid, Right 1 col = 1 tall featured card */}
            <div className="grid grid-cols-4 gap-6 items-stretch">
              
              {/* Left 3 Columns: 6 Cards in 3x2 Grid */}
              <div className="col-span-3 grid grid-cols-3 gap-6">
                {desktopCollections.map((item) => (
                  <div key={item.id} className="group flex flex-col justify-between transition-all duration-300">
                    <Link href={`/produk/${item.slug}`} className="flex-1 flex flex-col cursor-pointer">
                      <div className="overflow-hidden rounded-none bg-[#FCFAF7] border border-[#E5E2DC] transition-all duration-300">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="aspect-square w-full object-contain transition-transform duration-700 ease-out group-hover:scale-108"
                        />
                      </div>
                      <div className="mt-3 flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E] group-hover:text-[#C4A265] group-hover:underline">
                            {item.name}
                          </h3>
                          <p className="mt-0.5 text-[11px] sm:text-xs text-[#6E7068]">{item.subtext}</p>
                        </div>

                        {/* Plus (+) Add to Cart Button */}
                        <button
                          type="button"
                          aria-label="Add to Cart"
                          onClick={(e) => handleAddToCart(e, item)}
                          className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                            addedId === item.id
                              ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-md"
                              : "border-[#1F2022] text-[#1F2022] hover:bg-[#1F2022] hover:text-white hover:scale-110 shadow-xs"
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
                  </div>
                ))}
              </div>

              {/* Right 1 Column: Tall Featured Product */}
              <div className="col-span-1 flex flex-col justify-between">
                <Link href={`/produk/${desktopTallProduct.slug}`} className="group flex-1 flex flex-col justify-between cursor-pointer">
                  {/* Tall Image Container - Clean full height */}
                  <div className="flex-1 overflow-hidden rounded-none bg-[#FCFAF7] border border-[#E5E2DC] transition-all duration-300 min-h-[420px] flex items-center justify-center">
                    <img
                      src={desktopTallProduct.image}
                      alt={desktopTallProduct.name}
                      className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E] group-hover:text-[#C4A265] group-hover:underline">
                        {desktopTallProduct.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] sm:text-xs text-[#6E7068]">{desktopTallProduct.subtext}</p>
                    </div>

                    <button
                      type="button"
                      aria-label="Add to Cart"
                      onClick={(e) => handleAddToCart(e, desktopTallProduct)}
                      className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                        addedId === desktopTallProduct.id
                          ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-md"
                          : "border-[#1F2022] text-[#1F2022] hover:bg-[#1F2022] hover:text-white hover:scale-110 shadow-xs"
                      }`}
                    >
                      {addedId === desktopTallProduct.id ? (
                        <Check className="h-4 w-4 stroke-[3] animate-in zoom-in-50 duration-200" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Link>
              </div>

            </div>

            {/* View Catalog Link at Bottom Right below grid */}
            <div className="mt-8 flex justify-end">
              <Link
                href="/katalog"
                className="group inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#1B1C1E] transition-all duration-300 hover:text-[#C4A265] cursor-pointer"
              >
                <span className="border-b-2 border-[#1B1C1E] pb-0.5 group-hover:border-[#C4A265]">View Catalog</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

        </section>

        {/* LARGE SPACIOUS GAP BETWEEN COLLECTION AND WHY CHOOSE US SECTION */}
        <div className="h-8 sm:h-16 lg:h-24" />

        {/* WHY CHOOSE US Section - Rebuilt to match wireframe 100% */}
        <section
          id="about"
          className="relative w-full overflow-hidden bg-transparent"
        >
          {/* Inner layout container — DESKTOP ONLY */}
          <div className="hidden lg:block relative mx-auto max-w-7xl w-full" style={{ minHeight: "780px" }}>

            {/* Left Model Image — absolute, flush left, half-body */}
            <div
              className="absolute left-0 top-0 w-[44%] xl:w-[42%] h-full z-10 pointer-events-none select-none"
              aria-hidden="true"
            >
              <div
                className="relative w-full h-full"
                style={{
                  maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
                }}
              >
                <img
                  src="/Model-Dashboard-2.png"
                  alt="Why Choose Us Model Showcase"
                  className="w-full h-full object-cover object-top"
                  style={{ objectPosition: "left top" }}
                />
              </div>
            </div>

            {/* Right Text Content — shifted left close to model, centered text */}
            <div className="relative z-20 ml-[44%] xl:ml-[42%] lg:-ml-8 flex flex-col items-center justify-start px-10 xl:px-16 pt-36 lg:pt-44 pb-16 lg:pb-20 text-center">

              {/* WHY CHOOSE US label */}
              <span
                className="font-sans text-sm lg:text-base font-semibold uppercase tracking-[0.28em] text-[#1B1C1E]"
              >
                WHY CHOOSE US
              </span>

              {/* Main Heading */}
              <h2
                className="mt-4 font-sans text-3xl lg:text-[2.6rem] xl:text-[2.8rem] font-bold tracking-tight text-[#1B1C1E] leading-tight"
              >
                The Mark of Distinction
              </h2>

              {/* Intro Paragraph — wider than feature boxes (max-w-2xl) */}
              <p className="mt-5 text-xs lg:text-sm font-normal leading-relaxed text-[#3B3C3A] w-full max-w-2xl text-center">
                Crafted with uncompromising precision to elevate your everyday silhouette and define your signature presence.
              </p>

              {/* Feature Boxes — narrower than paragraph (max-w-lg) */}
              <div className="mt-16 lg:mt-20 flex flex-col gap-5 w-full max-w-lg text-left">

                {/* Feature Box 1 */}
                <div className="w-full bg-[#242621] px-6 py-5 rounded-none">
                  <h3 className="font-sans text-sm lg:text-base font-bold text-white tracking-wide">
                    Uncompromising Craftsmanship
                  </h3>
                  <p className="mt-2 text-xs lg:text-sm font-normal leading-relaxed text-[#C8C9C4]">
                    Sourced from the finest materials to elevate your everyday silhouette with enduring structure and luxury.
                  </p>
                </div>

                {/* Feature Box 2 */}
                <div className="w-full bg-[#242621] px-6 py-5 rounded-none">
                  <h3 className="font-sans text-sm lg:text-base font-bold text-white tracking-wide">
                    Signature Quality
                  </h3>
                  <p className="mt-2 text-xs lg:text-sm font-normal leading-relaxed text-[#C8C9C4]">
                    Immaculately crafted to define your presence and stand out in any private circle.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Mobile Layout — matching screenshot exactly */}
          <div className="lg:hidden w-full">

            {/* Top text block */}
            <div className="px-6 pt-10 pb-6 text-center">
              {/* WHY CHOOSE US — small label, centered */}
              <span className="font-sans text-sm sm:text-base font-semibold uppercase tracking-[0.3em] text-[#1B1C1E]">
                WHY CHOOSE US
              </span>
              {/* The Mark of Distinction — big main heading */}
              <h2 className="mt-3 font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#1B1C1E]">
                The Mark of Distinction
              </h2>
              {/* Paragraph — larger font */}
              <p className="mt-4 text-sm sm:text-base font-normal leading-relaxed text-[#3B3C3A] mx-auto max-w-xs">
                Crafted with uncompromising precision to elevate your everyday silhouette and define your signature presence.
              </p>
            </div>

            {/* Model photo + dark feature boxes overlaid at bottom */}
            <div className="relative w-full">
              {/* Full-width model photo with soft bottom fade */}
              <div
                className="w-full"
                style={{
                  maskImage: "linear-gradient(to bottom, black 55%, transparent 92%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 92%)",
                }}
              >
                <img
                  src="/Model-Dashboard-2.png"
                  alt="Why Choose Us Model Showcase"
                  className="w-full object-cover object-top block"
                  style={{ aspectRatio: "3/4" }}
                />
              </div>

              {/* Dark feature boxes overlaid at bottom of photo — with side margins & semi-transparent */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 px-4 pb-4">
                <div className="w-full bg-[#2F2B22]/80 px-5 py-4 rounded-none">
                  <h4 className="font-sans text-sm font-bold text-white tracking-wide">
                    Uncompromising Craftsmanship
                  </h4>
                  <p className="mt-1 text-xs font-normal leading-relaxed text-[#D2D0CB]">
                    Sourced from the finest materials to elevate your everyday silhouette with enduring structure and luxury.
                  </p>
                </div>
                <div className="w-full bg-[#2F2B22]/80 px-5 py-4 rounded-none">
                  <h4 className="font-sans text-sm font-bold text-white tracking-wide">
                    Signature Quality
                  </h4>
                  <p className="mt-1 text-xs font-normal leading-relaxed text-[#D2D0CB]">
                    Immaculately crafted to define your presence and stand out in any private circle.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* Bottom WhatsApp CTA Section — outer wrapper transparent, only inner box colored */}
        <div className="mt-12 sm:mt-16 lg:mt-24 mb-16 sm:mb-20 lg:mb-28 px-4 sm:px-6">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-none bg-[#353B2D] p-8 sm:p-12 text-center text-white shadow-xl transition-all duration-500 hover:shadow-2xl">
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
