// SmartCap Storefront Catalog Home UI
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Check, Truck, ArrowRight, Sparkles, Crown, ShieldCheck, Award } from "lucide-react";

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

  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

  const [displaySettings, setDisplaySettings] = useState<{
    collectionProductIds: string[];
    bestSellerProductIds: string[];
  }>({ collectionProductIds: [], bestSellerProductIds: [] });

  useEffect(() => {
    fetchCatalog()
      .then((data) => setProducts(data || []))
      .catch(() => setProducts([]));

    const loadSettings = () => {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("smartcap_store_settings");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setStoreSettings((prev) => ({ ...prev, ...parsed }));
          } catch (e) {}
        }

        const dispRaw = localStorage.getItem("smartcap_display_settings");
        if (dispRaw) {
          try {
            const parsedDisp = JSON.parse(dispRaw);
            setDisplaySettings({
              collectionProductIds: Array.isArray(parsedDisp.collectionProductIds) ? parsedDisp.collectionProductIds : [],
              bestSellerProductIds: Array.isArray(parsedDisp.bestSellerProductIds) ? parsedDisp.bestSellerProductIds : [],
            });
          } catch (e) {}
        }
      }
    };

    loadSettings();

    if (typeof window !== "undefined") {
      window.addEventListener("smartcap_display_updated", loadSettings);
      return () => window.removeEventListener("smartcap_display_updated", loadSettings);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeatureIdx((prev) => (prev === 0 ? 1 : 0));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const displayCollections = useMemo(() => {
    let list = products;
    if (displaySettings.collectionProductIds.length > 0) {
      const selected = products.filter((p) => displaySettings.collectionProductIds.includes(p.id));
      if (selected.length > 0) list = selected;
    }
    return list.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      subtext: item.material || item.category || "SmartCap Collection",
      image: item.imageUrl,
      price: item.price || 150000,
    }));
  }, [products, displaySettings.collectionProductIds]);

  const bestSellingProducts = useMemo(() => {
    let list = products;
    if (displaySettings.bestSellerProductIds.length > 0) {
      const selected = products.filter((p) => displaySettings.bestSellerProductIds.includes(p.id));
      if (selected.length > 0) list = selected;
    }
    return list.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      subtext: item.material || item.category || "Best Seller",
      image: item.imageUrl,
      price: item.price || 150000,
    }));
  }, [products, displaySettings.bestSellerProductIds]);

  const desktopCollections = useMemo(() => {
    return displayCollections;
  }, [displayCollections]);

  const displayTall = useMemo(() => {
    if (displayCollections.length > 6) {
      const item = displayCollections[6];
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        subtext: item.subtext || "Limited Release SKU",
        image: item.image,
        price: item.price || 150000,
      };
    }
    if (displayCollections.length > 0) {
      return {
        id: displayCollections[0].id,
        name: displayCollections[0].name,
        slug: displayCollections[0].slug,
        subtext: displayCollections[0].subtext || "Limited Release SKU",
        image: displayCollections[0].image,
        price: displayCollections[0].price || 150000,
      };
    }
    return null;
  }, [displayCollections]);

  const desktopTallProduct = useMemo(() => {
    return displayTall;
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
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
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
          <div className="flex h-7 w-7 items-center justify-center rounded-none bg-[#C4A265] text-[#1B1C1E]">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">{toastMsg}</span>
        </div>
      )}
      <main className="bg-transparent">
        {/* Hero Section matching wireframe */}
        <section className="relative w-full overflow-hidden bg-transparent pt-6 sm:pt-10 lg:pt-20 pb-8 sm:pb-12">
          
          {/* Soft Dark Ambient Radial Shadow Glow - Constrained to top hero */}
          <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-none bg-radial from-black/30 via-[#1B1C1E]/10 to-transparent blur-3xl opacity-60 z-0 overflow-hidden" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid items-start gap-12 lg:grid-cols-12">
              
              {/* Left Content Block (Cols 1-7) */}
              <div className="flex flex-col items-start lg:col-span-7 z-10 pr-0 lg:pr-6 pt-0 sm:pt-2 lg:pt-12">
                
                {/* Mobile Title Layout - Bold, sharp & perfectly proportioned for mobile screen */}
                <h1 className="lg:hidden font-sans text-3xl sm:text-5xl font-black uppercase tracking-[0.08em] text-[#1B1C1E] leading-[1.1] space-y-1">
                  <span className="block font-black leading-[1.1]">CROWN YOUR</span>
                  <span className="block font-black leading-[1.1]">INDIVIDUALITY.</span>
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
                
                <p className="mt-4 sm:mt-6 max-w-lg text-xs sm:text-base font-normal lg:font-medium leading-relaxed text-[#1B1C1E]/80">
                  Curated from the finest materials, our collection blends timeless sophistication with modern edge for the discerning wearer.
                </p>

                {/* Action Buttons Row - Optimized for mobile tap targets */}
                <div className="mt-6 lg:mt-10 flex flex-row items-center gap-4 sm:gap-6 lg:gap-8 w-full sm:w-auto">
                  {/* Discover More Button */}
                  <Link
                    href="/katalog"
                    className="inline-flex items-center justify-center rounded-none bg-[#353B2D] px-6 sm:px-8 lg:px-9 py-3 sm:py-3.5 lg:py-4 text-xs lg:text-sm font-extrabold text-white shadow-xl transition-all duration-300 hover:scale-[1.03] hover:bg-[#C4A265] hover:text-[#1B1C1E]"
                  >
                    Discover More
                  </Link>
                  
                  {/* Inquire on WhatsApp Link */}
                  <a
                    href={getWaLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 text-xs lg:text-sm font-extrabold text-[#1F2022] transition-colors hover:opacity-75 lg:hover:text-[#C4A265]"
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

          {/* Right Model Image Container - Optimized height for mobile */}
          <div className="relative group lg:absolute lg:right-0 lg:top-0 lg:w-[48%] xl:w-[46%] w-full z-10 flex flex-col items-end justify-start mt-4 sm:-mt-8 lg:mt-0">
            {/* Model Image - Sharp & Clean */}
            <div className="relative w-full h-[400px] sm:h-[580px] lg:h-[780px] xl:h-[860px] overflow-hidden flex items-end justify-end">
              <img
                src={heroImage}
                alt="SmartCap Hero Showcase"
                className="h-full w-full object-cover object-top lg:object-right-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Full-Width Edge-to-Edge repeating SMARTCAP.STUDIO bar with continuous infinite marquee loop */}
          <div className="relative z-30 w-full bg-[#353B2D] py-3.5 sm:py-5 shadow-none overflow-hidden border-y border-[#353B2D] select-none">
            <div className="animate-marquee flex items-center gap-8 sm:gap-14 text-xs sm:text-sm lg:text-base font-black uppercase text-white tracking-[0.4em] whitespace-nowrap">
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
              {/* Duplicate items to achieve 100% seamless infinite marquee scrolling */}
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
              <span>SMARTCAP.STUDIO</span>
              <span className="text-[#C4A265]">•</span>
            </div>
          </div>
        </section>

        {/* COLLECTION Section - Positioned directly below SMARTCAP.STUDIO marquee */}
        <section id="collections" className="mx-auto max-w-7xl px-4 pt-5 pb-8 sm:px-6 lg:px-8 sm:pt-8 lg:pb-12">
          
          {/* MOBILE UI (< lg) - Clean Transparent PNG Cards */}
          <div className="lg:hidden">
            <div className="mb-4">
              <h2 className="font-sans text-xs sm:text-2xl font-black uppercase tracking-[0.25em] text-[#1B1C1E]">
                COLLECTION
              </h2>
            </div>

            {/* 6 Small Cards Grid (2x3 on Mobile) - Clean Minimalist Transparent PNG Cards */}
            <div className="grid grid-cols-2 gap-3.5 sm:gap-6 items-stretch">
              {desktopCollections.slice(0, 6).map((item) => (
                <div key={`mob-col-${item.id}`} className="group flex flex-col justify-between transition-all duration-300">
                  <Link href={`/produk/${item.slug}`} className="flex-1 flex flex-col cursor-pointer">
                    {/* Transparent Product Image Showcase - Clean minimal float */}
                    <div className="overflow-hidden bg-transparent p-1 transition-all duration-300 flex items-center justify-center aspect-square">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="aspect-square w-full object-contain filter drop-shadow-xs transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                    </div>

                    {/* Metadata & Plus Button */}
                    <div className="mt-2.5 flex items-start justify-between gap-1.5 px-0.5">
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E] group-hover:text-[#C4A265] transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs font-extrabold text-[#353B2D]">
                          {item.price ? `Rp ${item.price.toLocaleString("id-ID")}` : "Rp 150.000"}
                        </p>
                      </div>

                      {/* Plus (+) Add to Cart Button */}
                      <button
                        type="button"
                        aria-label="Add to Cart"
                        onClick={(e) => handleAddToCart(e, item)}
                        className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                          addedId === item.id
                            ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-md"
                            : "border-[#1F2022]/25 text-[#1F2022] hover:bg-[#1F2022] hover:text-white hover:scale-110 shadow-xs"
                        }`}
                      >
                        {addedId === item.id ? (
                          <Check className="h-3.5 w-3.5 stroke-[3] animate-in zoom-in-50 duration-200" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* 1 Large Featured Showcase Banner Image for Mobile */}
            {displayTall && (
              <div className="mt-6 sm:mt-8 w-full">
                <Link href={`/produk/${displayTall.slug}`} className="group block cursor-pointer overflow-hidden bg-transparent p-2">
                  <div className="overflow-hidden bg-transparent p-4 transition-all duration-300">
                    <img
                      src={displayTall.image}
                      alt={displayTall.name}
                      className="w-full aspect-square sm:aspect-video object-contain filter drop-shadow-md transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="mt-3 flex flex-col items-start gap-1">
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E]">{displayTall.name}</h3>
                      <p className="text-xs font-black text-[#353B2D]">{displayTall.price ? `Rp ${displayTall.price.toLocaleString("id-ID")}` : "Rp 150.000"}</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Full Width "View Catalog" Button for Mobile */}
            <div className="mt-5 sm:mt-8 w-full">
              <Link
                href="/katalog"
                className="flex w-full items-center justify-center rounded-none bg-[#353B2D] text-white py-3.5 px-6 text-xs font-extrabold uppercase tracking-widest shadow-md transition-all duration-300 hover:bg-[#C4A265] hover:text-[#1B1C1E] active:scale-[0.98] cursor-pointer"
              >
                View Catalog
              </Link>
            </div>
          </div>

          {/* DESKTOP UI (>= lg) matching 6 small + 1 large layout */}
          <div className="hidden lg:block">
            <div className="mb-8">
              <h2 className="font-sans text-3xl lg:text-4xl font-black uppercase tracking-[0.15em] text-[#1B1C1E]">
                COLLECTIONS
              </h2>
            </div>

            {/* Asymmetric Desktop Layout: Left 3 cols = 6 small cards in 3x2 grid, Right 1 col = 1 large tall featured card */}
            <div className="grid grid-cols-4 gap-6 items-stretch">
              
              {/* Left 3 Columns: Max 6 Small Cards in 3x2 Grid */}
              <div className={desktopTallProduct ? "col-span-3 grid grid-cols-3 gap-6" : "col-span-4 grid grid-cols-3 gap-6"}>
                {desktopCollections.slice(0, 6).map((item) => (
                  <div key={`desk-col-${item.id}`} className="group flex flex-col justify-between transition-all duration-300">
                    <Link href={`/produk/${item.slug}`} className="flex-1 flex flex-col cursor-pointer">
                      <div className="overflow-hidden bg-transparent transition-all duration-300 p-2 flex items-center justify-center aspect-square">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="aspect-square w-full object-contain transition-transform duration-700 ease-out group-hover:scale-108"
                        />
                      </div>
                      <div className="mt-3 flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E] group-hover:text-[#C4A265] transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-xs font-black text-[#353B2D]">
                            {item.price ? `Rp ${item.price.toLocaleString("id-ID")}` : "Rp 150.000"}
                          </p>
                        </div>

                        {/* Plus (+) Add to Cart Button */}
                        <button
                          type="button"
                          aria-label="Add to Cart"
                          onClick={(e) => handleAddToCart(e, item)}
                          className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                            addedId === item.id
                              ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-md"
                              : "border-[#1F2022]/25 text-[#1F2022] hover:bg-[#1F2022] hover:text-white hover:scale-110 shadow-xs"
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

              {/* Right 1 Column: Exactly 1 Large Tall Featured Product */}
              {desktopTallProduct && (
                <div className="col-span-1 flex flex-col justify-between">
                  <Link href={`/produk/${desktopTallProduct.slug}`} className="group flex-1 flex flex-col justify-between cursor-pointer">
                    {/* Tall Image Container - Clean full height matching 2 rows without border */}
                    <div className="flex-1 overflow-hidden bg-transparent p-4 transition-all duration-300 min-h-[420px] flex flex-col items-center justify-center">
                      <img
                        src={desktopTallProduct.image}
                        alt={desktopTallProduct.name}
                        className="h-full w-full object-contain filter drop-shadow-md transition-transform duration-700 ease-out group-hover:scale-105 my-auto max-h-[340px]"
                      />
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E] group-hover:text-[#C4A265] transition-colors line-clamp-1">
                          {desktopTallProduct.name}
                        </h3>
                        <p className="mt-1 text-xs font-black text-[#353B2D]">
                          {desktopTallProduct.price ? `Rp ${desktopTallProduct.price.toLocaleString("id-ID")}` : "Rp 150.000"}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Add to Cart"
                        onClick={(e) => handleAddToCart(e, desktopTallProduct)}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                          addedId === desktopTallProduct.id
                            ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-md"
                            : "border-[#1F2022]/25 text-[#1F2022] hover:bg-[#1F2022] hover:text-white hover:scale-110 shadow-xs"
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
              )}
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

        {/* PROMO FREE SHIPPING BANNER ("FREE SHIPPING, UNCOMPROMISED STYLE.") */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-10 sm:my-20">
          <div className="relative overflow-hidden rounded-none bg-gradient-to-br from-[#272B21] via-[#353B2D] to-[#1F221A] p-6 sm:p-10 lg:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 border border-[#C4A265]/35 group">
            
            {/* Ambient Multi-layer Background Glow */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-none bg-[#C4A265]/25 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-70" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-none bg-[#353B2D] blur-3xl opacity-80" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

            {/* Left Content Column */}
            <div className="relative z-10 max-w-2xl text-left space-y-3">
              {/* Badge Indicator */}
              <div className="inline-flex items-center gap-2 rounded-none border border-[#C4A265]/40 bg-[#C4A265]/10 px-3.5 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#C4A265] backdrop-blur-md">
                <Truck className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Complimentary Shipping</span>
                <Sparkles className="h-3 w-3 fill-[#C4A265]" />
              </div>

              {/* Title with Gold Accent */}
              <h2 className="font-sans text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                FREE SHIPPING, <span className="text-[#C4A265] bg-gradient-to-r from-[#C4A265] via-[#E5CE9F] to-[#C4A265] bg-clip-text text-transparent">UNCOMPROMISED STYLE.</span>
              </h2>

              <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#E2E0D8]/90">
                Enjoy complimentary shipping on all SmartCap Studio orders with no minimum purchase required.
              </p>
            </div>

            {/* Right Call To Action Button */}
            <div className="relative z-10 w-full md:w-auto shrink-0">
              <Link
                href="/katalog"
                className="group/btn flex w-full md:inline-flex items-center justify-center gap-2.5 rounded-none bg-[#C4A265] hover:bg-white text-[#1B1C1E] px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider whitespace-nowrap"
              >
                <span>Shop Now</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US Section */}
        <section
          id="about"
          className="relative w-full overflow-hidden bg-transparent my-6 sm:my-12"
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
            <div className="relative z-20 ml-[44%] xl:ml-[42%] lg:-ml-8 flex flex-col items-center justify-start px-10 xl:px-16 pt-32 lg:pt-40 pb-16 lg:pb-20 text-center">

              {/* WHY CHOOSE US Badge */}
              <div className="inline-flex items-center gap-2 rounded-none border border-[#C4A265]/40 bg-[#C4A265]/10 px-4 py-1 text-xs font-black uppercase tracking-[0.25em] text-[#C4A265] backdrop-blur-md mb-2">
                <Crown className="h-3.5 w-3.5" />
                <span>WHY CHOOSE US</span>
              </div>

              {/* Main Heading */}
              <h2
                className="mt-3 font-sans text-3xl lg:text-[2.6rem] xl:text-[2.8rem] font-black tracking-tight text-[#1B1C1E] leading-tight"
              >
                The Mark of <span className="text-[#353B2D] italic">Distinction</span>
              </h2>

              {/* Intro Paragraph */}
              <p className="mt-4 text-xs lg:text-sm font-medium leading-relaxed text-[#3B3C3A] w-full max-w-2xl text-center">
                Crafted with uncompromising precision to elevate your everyday silhouette and define your signature presence.
              </p>

              {/* Feature Boxes */}
              <div className="mt-12 lg:mt-16 flex flex-col gap-4 w-full max-w-lg text-left">

                {/* Feature Box 1 */}
                <div className="w-full bg-[#1F221A] p-5 rounded-none border border-[#C4A265]/35 shadow-xl flex items-start gap-4 transition-all duration-300 hover:border-[#C4A265] hover:scale-[1.01]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-[#C4A265]/15 text-[#C4A265] border border-[#C4A265]/30">
                    <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm lg:text-base font-extrabold text-[#C4A265] tracking-wide uppercase">
                      Uncompromising Craftsmanship
                    </h3>
                    <p className="mt-1 text-xs lg:text-sm font-medium leading-relaxed text-[#E2E0D8]/90">
                      Sourced from the finest materials to elevate your everyday silhouette with enduring structure and luxury.
                    </p>
                  </div>
                </div>

                {/* Feature Box 2 */}
                <div className="w-full bg-[#1F221A] p-5 rounded-none border border-[#C4A265]/35 shadow-xl flex items-start gap-4 transition-all duration-300 hover:border-[#C4A265] hover:scale-[1.01]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-[#C4A265]/15 text-[#C4A265] border border-[#C4A265]/30">
                    <Award className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-sm lg:text-base font-extrabold text-[#C4A265] tracking-wide uppercase">
                      Signature Quality
                    </h3>
                    <p className="mt-1 text-xs lg:text-sm font-medium leading-relaxed text-[#E2E0D8]/90">
                      Immaculately crafted to define your presence and stand out in any private circle.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Mobile Layout — Clean Editorial with Auto-Looping Feature Carousel */}
          <div className="lg:hidden w-full">

            {/* Top text block */}
            <div className="px-4 pt-6 pb-4 text-center flex flex-col items-center">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#353B2D]">
                WHY CHOOSE US
              </span>
              <h2 className="mt-2 font-sans text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-[#1B1C1E]">
                The Mark of Distinction
              </h2>
              <p className="mt-2 text-xs font-medium leading-relaxed text-[#3B3C3A] mx-auto max-w-xs">
                Crafted with uncompromising precision to elevate your everyday silhouette and define your signature presence.
              </p>
            </div>

            {/* Model photo + Low-opacity auto-looping feature card overlaid at bottom */}
            <div className="relative w-full mt-2">
              {/* Full-width model photo with soft bottom fade */}
              <div
                className="w-full"
                style={{
                  maskImage: "linear-gradient(to bottom, black 50%, transparent 92%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 92%)",
                }}
              >
                <img
                  src="/Model-Dashboard-2.png"
                  alt="Why Choose Us Model Showcase"
                  className="w-full object-cover object-top block"
                  style={{ aspectRatio: "3/4" }}
                />
              </div>

              {/* Single Auto-Looping Card with Reduced Opacity */}
              <div className="absolute bottom-3 left-4 right-4 z-20">
                <div className="w-full bg-[#1F221A]/55 backdrop-blur-md border border-white/15 p-4 rounded-none shadow-lg transition-all duration-500 min-h-[95px] flex flex-col justify-between">
                  {activeFeatureIdx === 0 ? (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <h4 className="font-sans text-xs font-extrabold text-[#C4A265] tracking-wider uppercase">
                        Uncompromising Craftsmanship
                      </h4>
                      <p className="mt-1 text-[11px] font-medium leading-snug text-[#E2E0D8]/95">
                        Sourced from the finest materials to elevate your everyday silhouette with enduring structure and luxury.
                      </p>
                    </div>
                  ) : (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <h4 className="font-sans text-xs font-extrabold text-[#C4A265] tracking-wider uppercase">
                        Signature Quality
                      </h4>
                      <p className="mt-1 text-[11px] font-medium leading-snug text-[#E2E0D8]/95">
                        Immaculately crafted to define your presence and stand out in any private circle.
                      </p>
                    </div>
                  )}

                  {/* Subtle Carousel Progress Dots */}
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <button
                      type="button"
                      aria-label="Feature 1"
                      onClick={() => setActiveFeatureIdx(0)}
                      className={`h-1.5 transition-all duration-300 rounded-none cursor-pointer ${
                        activeFeatureIdx === 0 ? "w-5 bg-[#C4A265]" : "w-1.5 bg-white/40"
                      }`}
                    />
                    <button
                      type="button"
                      aria-label="Feature 2"
                      onClick={() => setActiveFeatureIdx(1)}
                      className={`h-1.5 transition-all duration-300 rounded-none cursor-pointer ${
                        activeFeatureIdx === 1 ? "w-5 bg-[#C4A265]" : "w-1.5 bg-white/40"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* OUR BEST SELLING Section - Ultra-Clean Luxury Minimalist Curation */}
        <section className="relative w-full bg-gradient-to-b from-[#282C22] via-[#24271F] to-[#1E211A] py-12 sm:py-20 my-12 sm:my-24 shadow-2xl border-y border-[#C4A265]/30 overflow-hidden group">
          {/* Ambient Radial Luxury Glow */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#C4A265]/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
          <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#353B2D]/40 blur-3xl opacity-80" />

          {/* Header Row aligned inside max-w-7xl container */}
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-10 text-white">
            <div>
              <h2 className="font-sans text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-[0.15em] text-white">
                OUR BEST SELLING
              </h2>
            </div>

            <Link
              href="/katalog"
              className="group/link inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#C4A265] transition-all duration-300 hover:text-white cursor-pointer"
            >
              <span>EXPLORE ALL CATALOG</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          </div>

          {/* Horizontally Scrollable Product Row (Clean Hat Showcase Cards) */}
          <div className="relative z-10 w-full overflow-x-auto pb-6 pt-2 no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-4 sm:gap-6 min-w-max">
              {bestSellingProducts.map((item) => (
                <div
                  key={`bestsell-${item.id}`}
                  className="w-[220px] sm:w-[280px] shrink-0 snap-start group/card flex flex-col justify-between transition-all duration-300"
                >
                  <Link
                    href={`/produk/${item.slug}`}
                    className="flex-1 flex flex-col cursor-pointer bg-transparent p-0 transition-all duration-300"
                  >
                    {/* Clean Hat Image - Pure Transparent PNG without border/outline */}
                    <div className="overflow-hidden bg-transparent p-1 transition-all duration-300 flex items-center justify-center aspect-square">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="aspect-square w-full object-contain filter drop-shadow-lg transition-transform duration-700 ease-out group-hover/card:scale-110 mix-blend-multiply"
                      />
                    </div>

                    {/* Product Meta */}
                    <div className="mt-3.5 flex items-end justify-between gap-2 px-1">
                      <div>
                        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover/card:text-[#C4A265] transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm font-extrabold text-[#C4A265]">
                          {item.price ? `Rp ${item.price.toLocaleString("id-ID")}` : "Rp 150.000"}
                        </p>
                      </div>

                      {/* Plus (+) Add to Cart Button */}
                      <button
                        type="button"
                        aria-label="Add to Cart"
                        onClick={(e) => handleAddToCart(e, item)}
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer ${
                          addedId === item.id
                            ? "bg-[#C4A265] border-[#C4A265] text-[#1B1C1E] scale-125 rotate-12 shadow-lg"
                            : "border-white/20 text-white hover:bg-[#C4A265] hover:border-[#C4A265] hover:text-[#1B1C1E] hover:scale-110 active:scale-95 shadow-xs"
                        }`}
                        title="Add to Cart"
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
          </div>
        </section>

        {/* Bottom WhatsApp CTA Section */}
        <div className="mt-10 sm:mt-16 lg:mt-24 mb-12 sm:mb-20 lg:mb-28 px-4 sm:px-6">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-none bg-[#353B2D] p-6 sm:p-12 text-center text-white shadow-xl transition-all duration-500 hover:shadow-2xl border border-[#454C3C]">
            {/* Ambient Glow accents */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-none bg-[#C4A265]/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 -bottom-12 h-56 w-56 rounded-none bg-white/10 blur-3xl" />

            <h3 className="font-sans text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Have a Vision? Let’s Talk!
            </h3>
            
            <p className="mx-auto mt-3 max-w-xl text-xs sm:text-base font-semibold leading-relaxed text-white/90">
              Whether you're curating a private collection or require custom community pieces, our concierge team is at your disposal.
            </p>

            <div className="mt-6 sm:mt-8 flex justify-center">
              <a
                href="https://wa.me/6281234567890?text=Halo%20SmartCap%20Studio%2C%20saya%20ingin%20berdiskusi%20mengenai%20custom%20koleksi%20topi."
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-none bg-[#6B705C] hover:bg-[#C4A265] hover:text-[#1B1C1E] px-7 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
