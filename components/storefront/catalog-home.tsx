"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

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

  useEffect(() => {
    fetchCatalog()
      .then((data) => setProducts(data))
      .catch(() => {});
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

  const heroImage = products.find((item) => item.imageUrl)?.imageUrl ?? "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80";

  const handleAddToCart = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`"${productName}" has been added to your Cart!`);
  };

  return (
    <StorefrontShell>
      <main className="bg-transparent">
        {/* Hero Section matching wireframe (Letter Spacing 15%, Line Height 125%, Inter Black) */}
        <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Left Content Block */}
            <div className="flex flex-col items-start pr-0 lg:pr-4">
              <h1 className="font-sans text-5xl font-black uppercase leading-[1.25] tracking-[0.15em] text-[#1F2022] sm:text-6xl lg:text-[4.25rem]">
                CROWN YOUR INDIVIDUALITY.
              </h1>
              
              <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-[#1F2022]/80 sm:text-lg">
                Curated from the finest materials, our collection blends timeless sophistication with modern edge for the discerning wearer.
              </p>

              {/* Action Buttons Row */}
              <div className="mt-10 flex flex-wrap items-center gap-8">
                {/* Discover More Button */}
                <Link
                  href="#collections"
                  className="inline-flex items-center justify-center rounded-none sm:rounded-xs bg-[#1F2022] px-9 py-4 text-sm font-extrabold text-[#FCFAF7] shadow-xl transition-all duration-300 hover:scale-[1.03] hover:bg-[#1F2022]/90 hover:shadow-2xl"
                >
                  Discover More
                </Link>
                
                {/* Inquire on WhatsApp Link */}
                <a
                  href="https://wa.me/6281234567890?text=Halo%20SmartCap%20Studio%2C%20saya%20ingin%20bertanya%20mengenai%20koleksi%20topi."
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-extrabold text-[#1F2022] transition-colors hover:text-[#05A852]"
                >
                  Inquire on WhatsApp
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            {/* Right Media Showcase */}
            <div className="group relative overflow-hidden rounded-3xl bg-[#E5E2DC] shadow-2xl transition-all duration-700 hover:shadow-[0_25px_60px_-15px_rgba(31,32,34,0.25)]">
              <img
                src={heroImage}
                alt="SmartCap Hero Showcase"
                className="h-[480px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 sm:h-[540px]"
              />
            </div>
          </div>
        </section>

        {/* COLLECTIONS Section matching wireframe layout */}
        <section id="collections" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <h2 className="mb-6 font-sans text-3xl font-extrabold uppercase tracking-widest text-[#1F2022] sm:text-4xl">
            COLLECTIONS
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-6 items-stretch">
            {/* First 3 Cards (Row 1, Cols 1-3) */}
            {displayCollections.slice(0, 3).map((item) => (
              <Link key={item.id} href={`/produk/${item.slug}`} className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="overflow-hidden rounded-2xl bg-[#E5E2DC] shadow-xs transition-shadow duration-300 group-hover:shadow-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                </div>
                <div className="mt-3.5 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1F2022] group-hover:underline">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#94908C]">{item.subtext}</p>
                  </div>
                  {/* Plus (+) Button triggers Add to Cart */}
                  <button
                    type="button"
                    aria-label="Add to Cart"
                    onClick={(e) => handleAddToCart(e, item.name)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#1F2022] text-[#1F2022] transition-all duration-300 hover:bg-[#1F2022] hover:text-[#FCFAF7] hover:scale-110 shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Link>
            ))}

            {/* Tall Vertical Card (Col 4, Spans Row 1 & 2) */}
            <div className="group flex flex-col justify-between cursor-pointer sm:col-span-2 lg:col-span-1 lg:col-start-4 lg:row-span-2 lg:row-start-1 h-full transition-all duration-300 hover:-translate-y-1">
              <Link href={`/produk/${displayTall.slug}`} className="flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden rounded-2xl bg-[#E5E2DC] w-full min-h-[300px] lg:min-h-[460px] shadow-xs transition-shadow duration-300 group-hover:shadow-md">
                  <img
                    src={displayTall.image}
                    alt={displayTall.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                </div>
                <div className="mt-3.5 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1F2022] group-hover:underline">
                      {displayTall.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#94908C]">{displayTall.subtext}</p>
                  </div>
                  {/* Plus (+) Button triggers Add to Cart */}
                  <button
                    type="button"
                    aria-label="Add to Cart"
                    onClick={(e) => handleAddToCart(e, displayTall.name)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#1F2022] text-[#1F2022] transition-all duration-300 hover:bg-[#1F2022] hover:text-[#FCFAF7] hover:scale-110 shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Link>

              {/* View Catalog Link on Bottom Right under Col 4 matching wireframe */}
              <div className="mt-4 flex justify-end">
                <Link
                  href="/katalog"
                  className="group inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-widest text-[#1F2022] transition hover:underline"
                >
                  View Catalog
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            {/* Next 3 Cards (Row 2, Cols 1-3) */}
            {displayCollections.slice(3, 6).map((item) => (
              <Link key={item.id} href={`/produk/${item.slug}`} className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="overflow-hidden rounded-2xl bg-[#E5E2DC] shadow-xs transition-shadow duration-300 group-hover:shadow-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                </div>
                <div className="mt-3.5 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1F2022] group-hover:underline">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#94908C]">{item.subtext}</p>
                  </div>
                  {/* Plus (+) Button triggers Add to Cart */}
                  <button
                    type="button"
                    aria-label="Add to Cart"
                    onClick={(e) => handleAddToCart(e, item.name)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#1F2022] text-[#1F2022] transition-all duration-300 hover:bg-[#1F2022] hover:text-[#FCFAF7] hover:scale-110 shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US Section (Shape & 4 Polaroid Pushpin Cards Strictly Preserved) */}
        <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            {/* WHY CHOOSE US Header */}
            <p className="font-sans text-2xl font-extrabold uppercase tracking-[0.2em] text-[#1F2022] sm:text-3xl lg:text-4xl">
              WHY CHOOSE US
            </p>
            {/* Black text color for "The Mark of Distinction" */}
            <h2 className="mt-20 font-sans text-xl font-bold tracking-tight text-[#1F2022] sm:text-2xl">
              The Mark of Distinction
            </h2>
            {/* Black text color for description */}
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#1F2022] sm:text-base">
              Crafted with uncompromising precision to elevate your everyday silhouette and define your signature presence.
            </p>
          </div>

          {/* 4 Tilted Polaroid Photo Cards with 3D Red Pushpins (Shape strictly preserved) */}
          <div className="relative mt-14 pb-14">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2">
              {/* Card 1: Exquisite Craftsmanship */}
              <div className="relative z-20 transition-all duration-500 ease-out lg:-rotate-12 lg:-translate-y-2 hover:z-30 hover:rotate-0 hover:scale-108">
                <div className="absolute -top-3.5 left-10 z-30 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#FF3B30] via-[#CC0000] to-[#990000] border-2 border-white shadow-lg shadow-black/40 ring-1 ring-black/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white/50 blur-[0.5px] -mt-1 -ml-1" />
                  </div>
                </div>
                <div className="rounded-xs border border-[#E5E2DC] bg-white p-4.5 shadow-2xl transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
                  <div className="aspect-4/3 overflow-hidden bg-[#F3F1ED]">
                    <img
                      src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80"
                      alt="Exquisite Craftsmanship"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold tracking-tight text-[#1F2022]">
                    Exquisite Craftsmanship
                  </h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-[#1F2022]/80">
                    Sourced from the finest twills, wool blends, and performance fibers ensuring enduring luxury, structural integrity, and day-long comfort.
                  </p>
                </div>
              </div>

              {/* Card 2: Curated Identity */}
              <div className="relative z-10 transition-all duration-500 ease-out lg:rotate-3 lg:translate-y-20 lg:-ml-6 hover:z-30 hover:rotate-0 hover:scale-108">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#FF3B30] via-[#CC0000] to-[#990000] border-2 border-white shadow-lg shadow-black/40 ring-1 ring-black/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white/50 blur-[0.5px] -mt-1 -ml-1" />
                  </div>
                </div>
                <div className="rounded-xs border border-[#E5E2DC] bg-white p-4.5 shadow-2xl transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
                  <div className="aspect-4/3 overflow-hidden bg-[#F3F1ED]">
                    <img
                      src="https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80"
                      alt="Curated Identity"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold tracking-tight text-[#1F2022]">
                    Curated Identity
                  </h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-[#1F2022]/80">
                    Designed to distinguish private circles, elite communities, independent brands, and discerning enthusiasts with bespoke aesthetic cohesion.
                  </p>
                </div>
              </div>

              {/* Card 3: Private Inquiries */}
              <div className="relative z-10 transition-all duration-500 ease-out lg:-rotate-2 lg:translate-y-24 lg:-mr-6 hover:z-30 hover:rotate-0 hover:scale-108">
                <div className="absolute -top-3.5 right-10 z-30 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#FF3B30] via-[#CC0000] to-[#990000] border-2 border-white shadow-lg shadow-black/40 ring-1 ring-black/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white/50 blur-[0.5px] -mt-1 -ml-1" />
                  </div>
                </div>
                <div className="rounded-xs border border-[#E5E2DC] bg-white p-4.5 shadow-2xl transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
                  <div className="aspect-4/3 overflow-hidden bg-[#F3F1ED]">
                    <img
                      src="https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=600&q=80"
                      alt="Private Inquiries"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold tracking-tight text-[#1F2022]">
                    Private Inquiries
                  </h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-[#1F2022]/80">
                    Skip the formalities. Connect directly with our concierge via WhatsApp for a bespoke and effortless acquisition experience.
                  </p>
                </div>
              </div>

              {/* Card 4: Immaculate Transit */}
              <div className="relative z-20 transition-all duration-500 ease-out lg:rotate-12 lg:-translate-y-2 hover:z-30 hover:rotate-0 hover:scale-108">
                <div className="absolute -top-3.5 left-8 z-30 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#FF3B30] via-[#CC0000] to-[#990000] border-2 border-white shadow-lg shadow-black/40 ring-1 ring-black/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white/50 blur-[0.5px] -mt-1 -ml-1" />
                  </div>
                </div>
                <div className="rounded-xs border border-[#E5E2DC] bg-white p-4.5 shadow-2xl transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
                  <div className="aspect-4/3 overflow-hidden bg-[#F3F1ED]">
                    <img
                      src="https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=600&q=80"
                      alt="Immaculate Transit"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold tracking-tight text-[#1F2022]">
                    Immaculate Transit
                  </h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-[#1F2022]/80">
                    Safeguarded in custom rigid packaging to preserve structural perfection from our studio straight to your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom WhatsApp CTA Section - Redesigned Unified Luxury Card */}
          <div className="mt-24 sm:mt-32">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#E5E2DC] bg-white/90 p-8 sm:p-12 text-center shadow-xl backdrop-blur-md transition-all duration-500 hover:shadow-2xl">
              {/* Ambient Glow accents */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[#05A852]/10 blur-3xl" />
              <div className="pointer-events-none absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-[#1F2022]/5 blur-3xl" />

              <h3 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1F2022]">
                Have a Vision? Let’s Talk!
              </h3>
              
              <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base font-semibold leading-relaxed text-[#1F2022]/80">
                Whether you're curating a private collection or require custom community pieces, our concierge team is at your disposal.
              </p>

              <div className="mt-8 flex justify-center">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20SmartCap%20Studio%2C%20saya%20ingin%20berdiskusi%20mengenai%20custom%20koleksi%20topi."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-[#05A852] px-9 py-4 text-sm font-extrabold text-white shadow-lg shadow-[#05A852]/25 transition-all duration-300 hover:bg-[#05A852]/90 hover:scale-105 hover:shadow-xl"
                >
                  Start WhatsApp Conversation
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}
