"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Loader, Sparkles } from "lucide-react";

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

// Fallback catalog products in case database is empty or loading
const fallbackProducts: CatalogProduct[] = [
  {
    id: "f1",
    name: "Urban Baseball Cap Classic",
    slug: "urban-baseball-cap-classic",
    description: "Urban style baseball cap in premium Cotton Twill, comfortable for daily wear.",
    price: 149000,
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
    stockCount: 12,
    category: "Baseball Cap",
    material: "Cotton Twill",
  },
  {
    id: "f2",
    name: "Classic Bucket Hat Denim",
    slug: "classic-bucket-hat-denim",
    description: "Waterproof denim bucket hat with casual outdoor aesthetics.",
    price: 129000,
    imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80",
    stockCount: 8,
    category: "Bucket Hat",
    material: "Waterproof Canvas",
  },
  {
    id: "f3",
    name: "Vintage Snapback Hip-Hop",
    slug: "vintage-snapback-hip-hop",
    description: "Vintage style snapback with premium corduroy and sharp structured visor.",
    price: 150000,
    imageUrl: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=600&q=80",
    stockCount: 15,
    category: "Snapback",
    material: "Corduroy Blend",
  },
  {
    id: "f4",
    name: "Trucker Hat Foam Panel Sporty",
    slug: "trucker-hat-foam-panel-sporty",
    description: "Sporty trucker hat with breathable rear mesh for maximum airflow.",
    price: 98000,
    imageUrl: "https://images.unsplash.com/photo-1517423568366-8b98471794e0?auto=format&fit=crop&w=600&q=80",
    stockCount: 19,
    category: "Trucker Cap",
    material: "Breathable Mesh",
  },
  {
    id: "f5",
    name: "Minimalist Baseball Dad Hat",
    slug: "minimalist-baseball-dad-hat",
    description: "Minimalist dad hat baseball cap with exclusive side embroidery detail.",
    price: 139000,
    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80",
    stockCount: 5,
    category: "Baseball Cap",
    material: "Washed Cotton",
  },
  {
    id: "f6",
    name: "Outdoor Bucket Hat Safari",
    slug: "outdoor-bucket-hat-safari",
    description: "Outdoor safari bucket hat ideal for adventures with a flexible chin strap.",
    price: 169000,
    imageUrl: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=600&q=80",
    stockCount: 10,
    category: "Bucket Hat",
    material: "Ripstop Nylon",
  },
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
        if (data.length > 0) {
          setProducts(data);
        } else {
          setProducts(fallbackProducts);
        }
      })
      .catch(() => {
        setProducts(fallbackProducts);
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
    <div className="w-full pb-16 space-y-10">
      
      {/* NEW CATALOG HERO SECTION MATCHING FIGMA WIREFRAME 100% */}
      <section className="relative w-full overflow-hidden bg-transparent pt-4 sm:pt-6 pb-0 min-h-[70vh] sm:min-h-[82vh] flex flex-col justify-between">
        
        <div className="relative z-10 mx-auto max-w-[1400px] w-full px-4 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center">
          
          {/* Main Hero Wrapper holding text & centered model image */}
          <div className="relative w-full flex items-center justify-center min-h-[460px] sm:min-h-[580px] lg:min-h-[680px]">
            
            {/* TEXT LAYER */}
            <div className="w-full flex flex-col justify-between items-center py-6 z-10 min-h-[420px] sm:min-h-[520px] lg:min-h-[600px]">
              
              {/* TOP ROW: OUR CA (left) and TALOG (right) - Same exact position as before */}
              <div className="w-full flex items-center justify-between gap-2 sm:gap-6">
                <h1
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-[#1B1C1E] whitespace-nowrap leading-none"
                  style={{
                    fontFamily: "'Akira Expanded', 'Impact', 'Arial Black', sans-serif",
                    letterSpacing: "0.22em",
                    fontWeight: 900,
                  }}
                >
                  OUR CA
                </h1>
                <h1
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-[#1B1C1E] whitespace-nowrap leading-none"
                  style={{
                    fontFamily: "'Akira Expanded', 'Impact', 'Arial Black', sans-serif",
                    letterSpacing: "0.22em",
                    fontWeight: 900,
                  }}
                >
                  TALOG
                </h1>
              </div>

              {/* MIDDLE ROW: Subtext Kiri & Subtext Kanan (Placed in the middle section, font-normal) */}
              <div className="w-full flex items-center justify-between gap-4 my-auto pt-8 sm:pt-16 text-xs sm:text-sm md:text-base font-normal text-[#1B1C1E]/90 tracking-wide">
                <p className="max-w-[260px] sm:max-w-[340px] text-left font-normal">
                  Explore our complete collection of caps
                </p>
                <p className="max-w-[260px] sm:max-w-[340px] text-right font-normal">
                  designed for community & everyday fashion.
                </p>
              </div>

            </div>

            {/* CENTER MODEL IMAGE LAYER - Full Height to Screen */}
            <div className="absolute inset-0 z-20 pointer-events-none flex items-end justify-center">
              <img
                src="/Display-Catalog-Model.png"
                alt="Catalog Model Showcase"
                className="h-[108%] max-h-[520px] sm:max-h-[660px] lg:max-h-[780px] w-auto object-contain object-bottom"
              />
            </div>

          </div>

        </div>

        {/* SMARTCAP.COM FULL-WIDTH TICKER BANNER (Matching wireframe - sleek padding & balanced tracking) */}
        <div className="mt-4 w-full bg-[#353B2D] py-3.5 sm:py-4 text-white overflow-hidden shadow-xs">
          <div className="flex justify-between items-center max-w-[1400px] mx-auto px-6 sm:px-12 text-xs sm:text-sm lg:text-base font-black uppercase tracking-[0.35em] whitespace-nowrap">
            <span>SMARTCAP STUDIO</span>
            <span className="hidden sm:inline">SMARTCAP STUDIO</span>
            <span>SMARTCAP STUDIO</span>
          </div>
        </div>

      </section>

      {/* SEARCH & SORT CONTROL BAR (Matching wireframe) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7068]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full rounded-none border border-[#DED9CF] bg-[#EFECE6] pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-[#1B1C1E] placeholder-[#6E7068] transition focus:border-[#353B2D] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-auto">
            <div className="relative flex items-center rounded-none border border-[#DED9CF] bg-[#EFECE6] px-4 py-3 text-xs sm:text-sm font-bold text-[#1B1C1E]">
              <span className="text-[#6E7068] mr-2">Short by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-extrabold text-[#1B1C1E] outline-none cursor-pointer pr-2"
              >
                <option value="terbaru">Latest</option>
                <option value="harga-asc">Price: Low to High</option>
                <option value="harga-desc">Price: High to Low</option>
                <option value="nama-asc">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID SECTION (Matching wireframe: 4-Column Grid on Desktop, rounded-none) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
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
