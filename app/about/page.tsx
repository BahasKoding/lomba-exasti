"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Crown, ShieldCheck, Award, CheckCircle2, ArrowUpRight } from "lucide-react";
import { StorefrontShell } from "@/components/storefront/storefront-shell";

export default function AboutPage() {
  return (
    <StorefrontShell>
      <main className="min-h-screen bg-[#F7F6F2] font-sans text-[#1B1C1E] selection:bg-[#C4A265] selection:text-white">
        
        {/* 1. Hero Header Section */}
        <section className="relative overflow-hidden bg-[#24271F] py-16 sm:py-24 lg:py-32 text-white border-b border-[#353B2D]">
          {/* Ambient Luxury Glows */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#C4A265]/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-none border border-[#C4A265]/40 bg-[#C4A265]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-[#C4A265] backdrop-blur-md mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#C4A265]" />
              <span>EST. 2026 / HERITAGE & INNOVATION</span>
            </div>

            <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-white leading-tight max-w-4xl">
              CRAFTING THE FUTURE OF HEADWEAR.
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-lg font-medium text-[#C8C9C4] max-w-2xl leading-relaxed">
              SmartCap Studio blends timeless headwear craftsmanship with cutting-edge digital AI curation. Built for the modern individualist who demands uncompromised quality.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-none bg-[#C4A265] hover:bg-white text-[#1B1C1E] px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none border border-white/30 bg-transparent hover:border-white hover:bg-white/10 text-white px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                <span>CONTACT US</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 2. Brand Story Showcase Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Image Showcase Block */}
            <div className="lg:col-span-6 relative">
              <div className="relative overflow-hidden rounded-none border border-[#353B2D] bg-[#24271F] p-4 sm:p-8 shadow-2xl">
                <img
                  src="/Model-Dashboard.png"
                  alt="SmartCap Studio Craftsmanship"
                  className="w-full aspect-4/5 sm:aspect-square object-contain filter drop-shadow-xl transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-[#1F221A]/90 backdrop-blur-md p-4 border border-[#C4A265]/40 text-white">
                  <p className="text-xs font-black uppercase tracking-widest text-[#C4A265]">AUTHENTIC CURATION</p>
                  <p className="mt-1 text-xs font-medium text-[#D2D0CB]">Every cap undergoes rigorous material assessment and digital cataloging.</p>
                </div>
              </div>
            </div>

            {/* Right Story Text Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C4A265]">OUR PHILOSOPHY</span>
                <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-wider text-[#1B1C1E] leading-tight">
                  REDEFINING HEADWEAR CULTURAL IDENTITY.
                </h2>
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-[#6E7068] font-medium">
                At SmartCap Studio, a cap is never just an accessory — it is the crown of your individuality. Founded in 2026, our mission is to deliver structured silhouettes, premium tactile fabrics, and bespoke visual aesthetics directly to cap enthusiasts worldwide.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-[#353B2D] text-[#C4A265]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E]">
                      PREMIUM SOURCED MATERIALS
                    </h3>
                    <p className="mt-0.5 text-xs text-[#6E7068] leading-relaxed">
                      Heavyweight cotton twill, brushed wool blends, and technical water-resistant nylons.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-[#353B2D] text-[#C4A265]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E]">
                      AI-POWERED INGESTION
                    </h3>
                    <p className="mt-0.5 text-xs text-[#6E7068] leading-relaxed">
                      Instant vision intelligence analyzes texture, weave, and design elements to curate detailed commercial specs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-[#353B2D] text-[#C4A265]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E]">
                      DIRECT WA INQUIRY FULFILLMENT
                    </h3>
                    <p className="mt-0.5 text-xs text-[#6E7068] leading-relaxed">
                      Seamless personal order assistant via WhatsApp for custom requests and instant support.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Core Values Grid (3 Pillars) */}
        <section className="bg-[#EFECE6] border-y border-[#DED9CF] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#C4A265]">WHY SMARTCAP STUDIO</span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-black uppercase tracking-wider text-[#1B1C1E]">
                BUILT ON THREE PILLARS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Pillar 1 */}
              <div className="bg-[#F7F6F2] p-8 rounded-none border border-[#DED9CF] shadow-sm space-y-4 hover:border-[#353B2D] transition-colors duration-300">
                <div className="flex h-12 w-12 items-center justify-center bg-[#353B2D] text-[#C4A265] rounded-none">
                  <Crown className="h-6 w-6" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#1B1C1E]">
                  01. PRECISION CRAFT
                </h3>
                <p className="text-xs sm:text-sm text-[#6E7068] leading-relaxed">
                  Every stitch, seam, and visor curve is calibrated for optimal comfort, structured durability, and timeless aesthetic appeal.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-[#F7F6F2] p-8 rounded-none border border-[#DED9CF] shadow-sm space-y-4 hover:border-[#353B2D] transition-colors duration-300">
                <div className="flex h-12 w-12 items-center justify-center bg-[#353B2D] text-[#C4A265] rounded-none">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#1B1C1E]">
                  02. SUSTAINABLE VALUE
                </h3>
                <p className="text-xs sm:text-sm text-[#6E7068] leading-relaxed">
                  We create classic silhouettes designed to transcend seasonal trends, reducing wasteful fast-fashion turnover.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-[#F7F6F2] p-8 rounded-none border border-[#DED9CF] shadow-sm space-y-4 hover:border-[#353B2D] transition-colors duration-300">
                <div className="flex h-12 w-12 items-center justify-center bg-[#353B2D] text-[#C4A265] rounded-none">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#1B1C1E]">
                  03. DIGITAL EXCELLENCE
                </h3>
                <p className="text-xs sm:text-sm text-[#6E7068] leading-relaxed">
                  An interactive digital catalog platform providing transparent product specs, live color swatches, and effortless ordering.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Stats Banner Section */}
        <section className="bg-[#24271F] py-14 sm:py-20 text-white border-b border-[#353B2D]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
              <div className="space-y-1">
                <p className="font-sans text-3xl sm:text-5xl font-black text-[#C4A265]">5,000+</p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C8C9C4]">HAPPY CUSTOMERS</p>
              </div>

              <div className="space-y-1">
                <p className="font-sans text-3xl sm:text-5xl font-black text-[#C4A265]">100%</p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C8C9C4]">PREMIUM FABRICS</p>
              </div>

              <div className="space-y-1">
                <p className="font-sans text-3xl sm:text-5xl font-black text-[#C4A265]">24/7</p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C8C9C4]">WA INQUIRY SUPPORT</p>
              </div>

              <div className="space-y-1">
                <p className="font-sans text-3xl sm:text-5xl font-black text-[#C4A265]">4.9 / 5</p>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C8C9C4]">SATISFACTION RATING</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Bottom CTA Banner */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-none bg-[#353B2D] p-8 sm:p-14 text-center text-white shadow-2xl border border-[#454C3C]">
            <h2 className="font-sans text-2xl sm:text-4xl font-black uppercase tracking-wider text-white">
              READY TO ELEVATE YOUR STYLE?
            </h2>
            <p className="mt-3 text-xs sm:text-base font-medium text-[#C8C9C4] max-w-xl mx-auto leading-relaxed">
              Explore our full collection of premium caps, snapbacks, and beanies in our interactive storefront catalog.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-none bg-[#C4A265] hover:bg-white text-[#1B1C1E] px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>VIEW ALL PRODUCTS</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </StorefrontShell>
  );
}
