"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Loader, Sparkles, Check } from "lucide-react";

import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { ProductCard } from "@/components/storefront/product-card";
import { fetchCatalog, type CatalogProduct } from "@/lib/public-catalog";

// Categories derived strictly from the storefront footer
const FOOTER_CATEGORIES = [
  "All",
  "Baseball Cap",
  "Trucker Cap",
  "Bucket Hat",
  "Snapback",
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("terbaru");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialCategoryParam) {
      const found = FOOTER_CATEGORIES.find(
        (c) => c.toLowerCase() === initialCategoryParam.toLowerCase()
      );
      if (found) setSelectedCategory(found);
    }
  }, [initialCategoryParam]);

  useEffect(() => {
    setLoading(true);
    fetchCatalog()
      .then((data) => {
        setProducts(data || []);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((item) => {
        const cat = item.category?.toLowerCase() || "";
        const target = selectedCategory.toLowerCase();
        return cat.includes(target) || target.includes(cat);
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.material && item.material.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q))
      );
    }

    // Sort Result
    if (sortBy === "harga-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "harga-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "nama-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="w-full pb-16">

      {/* ── CATALOG HERO ── */}
      <section className="relative w-full overflow-hidden bg-transparent">

        {/* ── MOBILE HERO (< md) — Exact Wireframe Layout (Stacked Title, Centered Subtext, Model Below) ── */}
        <div className="md:hidden flex flex-col items-center pt-8 pb-2 px-6 text-center">
          {/* Title: OUR CATALOG stacked in 2 lines */}
          <h1
            className="font-black uppercase text-[#1B1C1E] leading-[0.9] select-none"
            style={{
              fontFamily: "'Akira Expanded', 'Impact', 'Arial Black', sans-serif",
              fontSize: "clamp(2.2rem, 10vw, 3.4rem)",
              letterSpacing: "0.12em",
            }}
          >
            OUR<br />CATALOG
          </h1>

          {/* Subtext centered under title */}
          <p className="mt-4 max-w-[280px] text-xs font-normal text-[#1B1C1E]/80 leading-relaxed">
            Explore our complete collection of caps designed for community &amp; everyday fashion.
          </p>

          {/* Model Image positioned below subtext */}
          <div className="mt-4 w-full max-w-[320px] flex justify-center">
            <img
              src="/Display-Catalog-Model.png"
              alt="Catalog Model Showcase"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* ── DESKTOP HERO (≥ md) — Layered Stage Layout ── */}
        <div className="hidden md:block relative w-full overflow-hidden" style={{ height: "clamp(460px, 65vw, 760px)" }}>

          {/* ── HEADING: "OUR CATALOG" ── */}
          <div className="absolute inset-x-0 top-[18%] sm:top-[20%] lg:top-[22%] z-10 pointer-events-none flex justify-center px-4">
            <h1
              className="w-full text-center font-black uppercase text-[#1B1C1E] leading-none select-none whitespace-nowrap"
              style={{
                fontFamily:    "'Akira Expanded', 'Impact', 'Arial Black', sans-serif",
                letterSpacing: "clamp(0.04em, 1.3vw, 0.18em)",
                fontWeight:    900,
                fontSize:      "clamp(2.8rem, 6.2vw, 6.2rem)",
              }}
            >
              OUR CATALOG
            </h1>
          </div>

          {/* ── MODEL IMAGE: centered, bottom-aligned, z-20 (in front of heading) ── */}
          <div className="absolute inset-0 z-20 pointer-events-none flex items-end justify-center">
            <img
              src="/Display-Catalog-Model.png"
              alt="Catalog Model Showcase"
              className="w-auto object-contain object-bottom"
              style={{ height: "clamp(360px, 62vw, 740px)", maxHeight: "100%" }}
            />
          </div>

          {/* ── SUBTEXT ROW: positioned at neck level (top: 52%), pinned responsively at container boundaries ── */}
          <div
            className="absolute inset-x-0 z-30 flex items-start justify-between max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pointer-events-none"
            style={{ top: "52%" }}
          >
            <p className="max-w-[200px] sm:max-w-[260px] lg:max-w-[320px] text-left text-xs sm:text-sm lg:text-base font-normal text-[#1B1C1E]/80 leading-snug">
              Explore our complete collection of caps
            </p>
            <p className="max-w-[200px] sm:max-w-[260px] lg:max-w-[320px] text-right text-xs sm:text-sm lg:text-base font-normal text-[#1B1C1E]/80 leading-snug">
              designed for community &amp; everyday fashion.
            </p>
          </div>

        </div>

        {/* ── TICKER BANNER (Continuous Infinite Marquee Loop) ── */}
        <div className="relative z-30 w-full bg-[#353B2D] py-3.5 sm:py-4 text-white overflow-hidden shadow-xs border-y border-[#353B2D] select-none">
          <div className="animate-marquee flex items-center gap-8 sm:gap-14 text-xs sm:text-sm lg:text-base font-black uppercase tracking-[0.35em] whitespace-nowrap">
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
            {/* Duplicate items for continuous seamless infinite loop */}
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
            <span>SMARTCAP.STUDIO</span>
            <span className="opacity-60">•</span>
          </div>
        </div>

      </section>

      {/* ── SEARCH & SORT BAR ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        <div className="flex flex-row items-center justify-between gap-3 sm:gap-4 w-full">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7068]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full rounded-none border border-[#DED9CF] bg-[#EFECE6] pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-[#1B1C1E] placeholder-[#6E7068] transition focus:border-[#353B2D] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Sort Icon-Only Button & Custom Styled Dropdown */}
          <div className="relative shrink-0" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              aria-label="Urutkan Produk"
              title="Sort Options"
              className={`flex h-[46px] w-[46px] items-center justify-center rounded-none border transition-all cursor-pointer shadow-xs ${
                isSortOpen
                  ? "bg-[#353B2D] text-white border-[#353B2D]"
                  : "border-[#DED9CF] bg-[#EFECE6] text-[#1B1C1E] hover:border-[#353B2D] hover:bg-[#353B2D] hover:text-white"
              }`}
            >
              <SlidersHorizontal className="h-5 w-5 stroke-[2]" />
            </button>

            {/* Styled Dropdown Menu */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-none border border-[#DED9CF] bg-[#EFECE6] p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-[#DED9CF] mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#6E7068]">
                    Sort By
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {[
                    { value: "terbaru", label: "Latest" },
                    { value: "harga-asc", label: "Price: Low to High" },
                    { value: "harga-desc", label: "Price: High to Low" },
                    { value: "nama-asc", label: "Name: A-Z" },
                  ].map((option) => {
                    const isSelected = sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2.5 text-xs font-extrabold transition text-left cursor-pointer rounded-none ${
                          isSelected
                            ? "bg-[#353B2D] text-white"
                            : "text-[#1B1C1E] hover:bg-[#DED9CF]/60 hover:text-[#1B1C1E]"
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 stroke-[3] text-white shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID: 3 columns desktop, 2 columns mobile ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#6E7068] space-y-3">
            <Loader className="h-8 w-8 animate-spin text-[#353B2D]" />
            <p className="text-sm font-semibold">Loading catalog items...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-none border border-[#DED9CF] bg-white p-12 text-center shadow-xs space-y-3">
            <p className="text-base font-bold text-[#1B1C1E]">No caps found</p>
            <p className="text-xs text-[#6E7068]">
              There are currently no products matching your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}


export default function CatalogPage() {
  return (
    <StorefrontShell>
      <main className="min-h-screen bg-transparent">
        <Suspense
          fallback={
            <div className="flex justify-center py-24 text-[#94908C]">
              <Loader className="h-8 w-8 animate-spin text-[#1F2022]" />
            </div>
          }
        >
          <CatalogContent />
        </Suspense>
      </main>
    </StorefrontShell>
  );
}
