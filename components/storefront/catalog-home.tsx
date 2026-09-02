"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader, Sparkles, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/storefront/product-card";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { fetchCatalog, type CatalogProduct } from "@/lib/public-catalog";

const featurePills = ["Premium Material", "Ready Stock", "Fast Response", "Fashionable"];

export function CatalogHome() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCatalog();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat katalog.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((item) => item.category).filter(Boolean))) as string[];
    return unique.length ? ["Semua", ...unique] : ["Semua"];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "Semua" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  const heroImage = products.find((item) => item.imageUrl)?.imageUrl ?? "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80";

  return (
    <StorefrontShell>
      <main className="bg-[#FCFAF7]">
        {/* Hero Section matching user reference image */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col items-start pr-0 lg:pr-4">
              <h1 className="font-sans text-5xl font-black uppercase leading-[1.1] tracking-[0.15em] text-[#1F2022] sm:text-6xl lg:text-[4.25rem]">
                CROWN YOUR INDIVIDUALITY.
              </h1>
              
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#94908C] sm:text-lg">
                Curated from the finest materials, our collection blends timeless sophistication with modern edge for the discerning wearer.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link
                  href="#catalog"
                  className="inline-flex items-center justify-center rounded-full bg-[#1F2022] px-8 py-4 text-sm font-semibold text-[#FCFAF7] shadow-sm transition hover:bg-[#1F2022]/90 hover:shadow-md"
                >
                  Discover More
                </Link>
                
                <a
                  href="https://wa.me/6281234567890?text=Halo%20SmartCap%20Studio%2C%20saya%20ingin%20bertanya%20mengenai%20koleksi%20topi."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-[#1F2022] transition hover:opacity-70"
                >
                  Inquire on WhatsApp
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl">
              <img
                src={heroImage}
                alt="SmartCap Hero Showcase"
                className="h-[480px] w-full object-cover sm:h-[540px]"
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] p-6 shadow-xs sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94908C]">Why choose us</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1F2022] sm:text-3xl">Built for style and everyday comfort</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#E5E2DC] bg-[#FCFAF7] px-4 py-2 text-sm font-semibold text-[#1F2022]">
                <Star className="h-4 w-4 fill-[#1F2022] text-[#1F2022]" />
                Rated 4.9 by shoppers
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {["Bahan berkualitas dan tahan lama", "Desain modern untuk berbagai gaya", "Proses pemesanan cepat via WhatsApp"].map((item) => (
                <div key={item} className="flex items-start gap-3.5 rounded-2xl border border-[#E5E2DC] bg-[#FCFAF7] p-4.5">
                  <div className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-[#1F2022] text-[#FCFAF7]">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm font-semibold leading-6 text-[#1F2022]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalog" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94908C]">Featured collection</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#1F2022] sm:text-4xl">Katalog SmartCap</h2>
            </div>
            <Badge variant="outline" className="w-fit rounded-full border-[#E5E2DC] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#1F2022]">
              {filteredProducts.length} Produk
            </Badge>
          </div>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama topi..."
              className="h-12 max-w-md rounded-2xl border-[#E5E2DC] bg-[#FFFFFF] text-[#1F2022] placeholder-[#94908C] focus-visible:ring-[#1F2022]"
            />
            {categories.length > 1 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                      activeCategory === category
                        ? "border-[#1F2022] bg-[#1F2022] text-[#FCFAF7]"
                        : "border-[#E5E2DC] bg-[#FFFFFF] text-[#1F2022] hover:border-[#1F2022]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] py-24 text-[#94908C]">
              <Loader className="mr-3 h-5 w-5 animate-spin text-[#1F2022]" />
              Memuat katalog...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-sm font-medium text-red-700">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-[#E5E2DC] bg-[#FFFFFF] p-10 text-center text-sm font-medium text-[#94908C]">
              Belum ada produk di etalase. Produk yang sudah di-approve akan tampil di sini.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </StorefrontShell>
  );
}
