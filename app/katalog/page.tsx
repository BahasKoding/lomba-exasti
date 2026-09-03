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
      // Match query parameter to categories
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

  // Dynamically combine footer categories with any new categories present in DB items
  const availableCategories = useMemo(() => {
    const set = new Set<string>(FOOTER_CATEGORIES);
    products.forEach((p) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set);
  }, [products]);

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* PAGE HERO HEADER */}
      <div className="space-y-3">
        <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[0.15em] text-[#1F2022]">
          Cap Catalog
        </h1>
        <p className="max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-[#1F2022]/80">
          Explore our complete collection of caps designed for community & everyday fashion.
        </p>
      </div>

      {/* FILTER & CONTROL BAR */}
      <div className="overflow-hidden rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] p-6 shadow-xs space-y-5">
        
        {/* Search Input & Sort Dropdown Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#94908C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search caps by name, category, or description..."
              className="w-full h-11 rounded-2xl border border-[#E5E2DC] bg-[#FCFAF7] pl-11 pr-4 text-sm font-semibold text-[#1F2022] placeholder-[#94908C] outline-none transition-colors focus:border-[#1F2022] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 rounded-2xl border border-[#E5E2DC] bg-[#FCFAF7] px-4 py-2.5 text-xs font-bold text-[#1F2022]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#94908C]" />
              <span className="text-[#94908C]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-extrabold text-[#1F2022] outline-none cursor-pointer"
              >
                <option value="terbaru">Latest</option>
                <option value="harga-asc">Price: Low to High</option>
                <option value="harga-desc">Price: High to Low</option>
                <option value="nama-asc">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-[#E5E2DC]/60">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#94908C] mr-2">
            Category:
          </span>
          {availableCategories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-xs font-extrabold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#1F2022] text-[#FCFAF7] shadow-md shadow-[#1F2022]/10 scale-[1.02]"
                    : "bg-[#FCFAF7] border border-[#E5E2DC] text-[#1F2022] hover:bg-[#E5E2DC]/50"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCT COUNT INDICATOR */}
      <div className="flex items-center justify-between text-sm font-bold text-[#1F2022]">
        <p>
          Showing <span className="text-amber-700 font-extrabold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 && "s"}
        </p>
        {selectedCategory !== "All" && (
          <span className="text-xs font-semibold text-[#94908C]">
            Filter: <span className="text-[#1F2022] font-bold">{selectedCategory}</span>
          </span>
        )}
      </div>

      {/* PRODUCT GRID SECTION */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#94908C] space-y-3">
          <Loader className="h-8 w-8 animate-spin text-[#1F2022]" />
          <p className="text-sm font-semibold">Loading cap collection...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-[#E5E2DC] bg-white p-12 text-center shadow-xs space-y-3">
          <p className="text-base font-bold text-[#1F2022]">No matching caps found</p>
          <p className="text-xs text-[#94908C]">
            Try changing your search keywords or select another category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#1F2022] px-6 py-2 text-xs font-bold text-[#FCFAF7]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
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
