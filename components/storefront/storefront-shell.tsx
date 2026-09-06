"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FloatingCartBadge } from "@/components/storefront/floating-cart-badge";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    whatsappNumber: "6281234567890",
    inquiryTemplate: "Hello SmartCap Studio, I would like to inquire about..",
    storeName: "SmartCap Studio",
    tagline: "Crown Your Individuality",
    address: "Jl. Haji Nawir Husadah II, Jakarta, Indonesia",
    instagramUrl: "https://instagram.com",
    tiktokUrl: "",
    facebookUrl: "",
    xUrl: "",
  });
  const pathname = usePathname();

  useEffect(() => {
    // Check if admin is logged in via localStorage or cookie
    const isLogged =
      typeof window !== "undefined" &&
      (localStorage.getItem("admin_logged_in") === "true" ||
        document.cookie.includes("admin_logged_in=true"));
    setIsAdminLoggedIn(!!isLogged);

    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("smartcap_store_settings");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.whatsappNumber && !parsed.whatsappNumber.startsWith("62")) {
            parsed.whatsappNumber = "62" + parsed.whatsappNumber.replace(/^0+/, "");
          }
          setStoreSettings((prev) => ({ ...prev, ...parsed }));
        } catch (e) {}
      }
    }
  }, []);

  const navItems = [
    { href: "/", label: isAdminLoggedIn ? "Dashboard" : "Home" },
    { href: "/katalog", label: "Catalog" },
    { href: "/#about", label: "About" },
    { href: "/cart", label: "Cart" },
  ];

  const isItemActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/katalog") return pathname === "/katalog" || pathname.startsWith("/produk/");
    return pathname === href;
  };

  const getWaLink = () => {
    const rawNum = storeSettings.whatsappNumber.replace(/[^\d]/g, "");
    const cleanNum = rawNum.startsWith("62") ? rawNum : "62" + rawNum.replace(/^0+/, "");
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(storeSettings.inquiryTemplate)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F6F2] via-[#EFECE6] to-[#E3DFD5] font-sans text-[#1B1C1E]">
      {/* Header Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#DED9CF] bg-[#F7F6F2]/95 backdrop-blur-md">
        <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Header Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F2022] text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white text-white">
                <polygon points="12 5 19 18 5 18" fill="currentColor" />
              </svg>
            </div>
            <span className="font-sans text-base font-bold text-[#1B1C1E]">
              {storeSettings.storeName || "SmartCap Studio"}
            </span>
          </Link>

          {/* Centered Navigation Links with Active Page Indicator */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
            {navItems.map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative py-1 text-sm transition-colors duration-300 ${
                    active
                      ? "font-black text-[#353B2D] after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-full after:bg-[#353B2D]"
                      : "font-bold text-[#1B1C1E] hover:text-[#C4A265] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#353B2D] hover:after:w-full after:transition-all after:duration-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Far Right Action: Admin Badge (if logged in) or Login link (Desktop only, mobile is inside Hamburger) */}
          <div className="flex items-center gap-4">
            {isAdminLoggedIn ? (
              <Link
                href="/admin"
                className="hidden md:inline-flex relative items-center gap-2 rounded-none border border-[#353B2D] bg-[#353B2D] px-4 py-1.5 text-xs font-extrabold tracking-wide text-white shadow-xs hover:bg-[#C4A265] hover:border-[#C4A265] transition-all"
              >
                <span className="h-2 w-2 rounded-none bg-emerald-400 animate-pulse"></span>
                <span className="underline underline-offset-4 decoration-2 decoration-white/70">Admin</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={`hidden md:inline-block text-sm transition ${
                  pathname === "/login"
                    ? "font-black text-[#353B2D] underline decoration-2 decoration-[#C4A265] underline-offset-4"
                    : "font-extrabold text-[#1B1C1E] hover:text-[#C4A265]"
                }`}
              >
                Login
              </Link>
            )}

            {/* Mobile Hamburger Drawer (No Outline/Border) */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className="md:hidden flex h-10 w-10 items-center justify-center rounded-none border-0 bg-transparent text-[#1F2022] hover:bg-[#1F2022]/10 transition-all cursor-pointer outline-none focus:outline-none ring-0 shadow-none">
                <Menu className="h-6 w-6 stroke-[2]" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px] sm:w-[300px] border-l border-[#1F2022]/20 bg-[#D8D4CD] p-8 flex flex-col justify-between">
                <div>
                  <SheetHeader className="text-left border-b border-[#1F2022]/10 pb-6 mb-8">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F2022] text-white shadow-xs">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white text-white">
                          <polygon points="12 5 19 18 5 18" fill="currentColor" />
                        </svg>
                      </div>
                      <SheetTitle className="font-sans text-base font-bold text-[#1F2022]">
                        {storeSettings.storeName}
                      </SheetTitle>
                    </div>
                  </SheetHeader>
                  <nav className="flex flex-col gap-8 text-lg font-bold text-[#1F2022]">
                    {navItems.map((item) => {
                      const active = isItemActive(item.href);
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`transition-opacity hover:opacity-75 ${
                            active ? "font-black underline underline-offset-4 decoration-2" : "font-medium text-[#1F2022]/80"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                    
                    <div className="mt-4 border-t border-[#1F2022]/10 pt-6">
                      {isAdminLoggedIn ? (
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex w-full items-center justify-center gap-2 rounded-none bg-[#1F2022] py-3 text-xs font-extrabold text-white shadow-md transition hover:bg-black"
                        >
                          <span className="h-2 w-2 rounded-none bg-emerald-400 animate-pulse"></span>
                          Dashboard Admin
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex w-full items-center justify-center gap-2 rounded-none py-3 text-xs font-extrabold shadow-xs transition ${
                            pathname === "/login"
                              ? "bg-[#1F2022] text-white"
                              : "border border-[#1F2022] bg-white text-[#1F2022] hover:bg-[#1F2022] hover:text-white"
                          }`}
                        >
                          Login Admin
                        </Link>
                      )}
                    </div>
                  </nav>
                </div>

                <div className="pt-6 border-t border-[#1F2022]/10">
                  <span className="text-xs font-bold text-[#1F2022]/60 tracking-wider">
                    {storeSettings.storeName || "Smartcap Studio"}
                  </span>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Floating Sticky Shopping Bag Pop Up */}
      <FloatingCartBadge />

      {/* Footer Section with distinct background boundary */}
      <footer className="border-t-2 border-[#D5D0C5] bg-[#E5E1D7] shadow-inner">

        {/* ── MOBILE FOOTER (< md) — wireframe layout, desktop styling ── */}
        <div className="md:hidden px-5 py-10 space-y-7">

          {/* Brand + Description + Social Icons Row */}
          <div className="flex items-start gap-4">

            {/* Navbar Logo — dark circle with triangle SVG (same as navbar) */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F2022] text-white shadow-xs">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white text-white">
                <polygon points="12 5 19 18 5 18" fill="currentColor" />
              </svg>
            </div>

            {/* Brand Text + Description — constrained width so icons aren't pushed to edge */}
            <div className="min-w-0 flex flex-col justify-center">
              <span className="font-sans text-base font-black uppercase tracking-wider text-[#1F2022] leading-none">
                {storeSettings.storeName.split(" ")[0] || "SMARTCAP"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94908C] mt-1">
                {storeSettings.storeName.split(" ").slice(1).join(" ") || "Studio Catalog"}
              </span>
              <p className="mt-2 text-xs leading-relaxed text-[#1F2022] font-normal max-w-[170px]">
                {storeSettings.storeName} is a premier digital catalog platform curated for hat enthusiasts.
              </p>
            </div>

            {/* Social Icons — logo only, no text, next to brand block */}
            <div className="flex flex-col gap-3 shrink-0 pt-1">
              {/* WhatsApp Icon */}
              <a
                href={getWaLink()}
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
                className="group transition-transform duration-200 hover:scale-110"
              >
                <svg className="h-6 w-6 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.528 5.856L.057 23.885a.5.5 0 0 0 .615.612l6.118-1.604A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.676-.512-5.205-1.405l-.373-.222-3.865 1.013 1.032-3.768-.243-.388A9.965 9.965 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </a>
              {/* Instagram Icon */}
              {storeSettings.instagramUrl && (
                <a
                  href={storeSettings.instagramUrl.startsWith("http") ? storeSettings.instagramUrl : `https://instagram.com/${storeSettings.instagramUrl.replace(/^@/, "").replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  className="group transition-transform duration-200 hover:scale-110"
                >
                  <svg className="h-6 w-6 text-[#E1306C]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
            </div>

          </div>

          {/* Navigation + Contact & Location — 2 column grid */}
          <div className="grid grid-cols-2 gap-6 pt-2">

            {/* Navigation Column */}
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-[#1F2022]">Navigation</h3>
              <ul className="space-y-2 text-sm font-semibold text-[#1F2022]">
                <li><Link href="/" className="hover:opacity-70 transition">{isAdminLoggedIn ? "Dashboard" : "Home"}</Link></li>
                <li><Link href="/katalog" className="hover:opacity-70 transition">Catalog</Link></li>
                <li><Link href="/#about" className="hover:opacity-70 transition">About</Link></li>
                <li><Link href="/cart" className="hover:opacity-70 transition">Cart</Link></li>
                <li><Link href={isAdminLoggedIn ? "/admin" : "/login"} className="hover:opacity-70 transition">{isAdminLoggedIn ? "Admin" : "Login"}</Link></li>
              </ul>
            </div>

            {/* Contact & Location — same icon style as desktop */}
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-[#1F2022]">Contact & Location</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E2DC] bg-white text-[#1F2022] shadow-xs cursor-default">
                    <svg className="h-4 w-4 text-[#1F2022]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-[#1F2022] leading-relaxed">{storeSettings.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E2DC] bg-white text-[#1F2022] shadow-xs cursor-default">
                    <svg className="h-4 w-4 text-[#1F2022]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-[#1F2022]">+62 {storeSettings.whatsappNumber}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Copyright — same as desktop */}
          <div className="border-t border-[#E5E2DC] pt-5 text-center text-[10px] font-semibold text-[#94908C]">
            © 2026 {storeSettings.storeName}. All rights reserved. {storeSettings.tagline}.
          </div>
        </div>

        {/* ── DESKTOP FOOTER (≥ md) — original layout preserved ── */}
        <div className="hidden md:block">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              {/* Left Column: Brand Logo, Description & Social Media Links */}
              <div className="space-y-6 lg:col-span-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E5E2DC] bg-white text-[#1F2022] font-black text-lg shadow-xs">
                    SC
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-lg font-black uppercase tracking-wider text-[#1F2022] leading-none">
                      {storeSettings.storeName.split(" ")[0] || "SMARTCAP"}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94908C] mt-1">
                      {storeSettings.storeName.split(" ").slice(1).join(" ") || "Studio Catalog"}
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#1F2022]">
                  {storeSettings.storeName} is a premier digital catalog platform curated for hat enthusiasts, blending timeless craft with AI-powered ingestion.
                </p>
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <a href={getWaLink()} target="_blank" rel="noreferrer" className="group flex items-center gap-2.5 text-xs font-bold text-[#1F2022] transition-transform duration-300 hover:scale-105" title="Direct WhatsApp Inquiry">
                    <svg className="h-5 w-5 text-[#25D366] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                    <span className="font-extrabold group-hover:text-[#25D366] transition-colors">WhatsApp</span>
                  </a>
                  {storeSettings.instagramUrl && (
                    <a href={storeSettings.instagramUrl.startsWith("http") ? storeSettings.instagramUrl : `https://instagram.com/${storeSettings.instagramUrl.replace(/^@/, "").replace(/\s+/g, "")}`} target="_blank" rel="noreferrer" className="text-xs font-extrabold text-[#1F2022] hover:text-[#C4A265] transition underline decoration-1 underline-offset-4">
                      Instagram: {storeSettings.instagramUrl}
                    </a>
                  )}
                  {storeSettings.tiktokUrl && (
                    <a href={storeSettings.tiktokUrl.startsWith("http") ? storeSettings.tiktokUrl : `https://tiktok.com/@${storeSettings.tiktokUrl.replace(/^@/, "").replace(/\s+/g, "")}`} target="_blank" rel="noreferrer" className="text-xs font-extrabold text-[#1F2022] hover:text-[#C4A265] transition underline decoration-1 underline-offset-4">
                      TikTok: {storeSettings.tiktokUrl}
                    </a>
                  )}
                  {storeSettings.facebookUrl && (
                    <a href={storeSettings.facebookUrl.startsWith("http") ? storeSettings.facebookUrl : `https://facebook.com/${storeSettings.facebookUrl.replace(/\s+/g, "")}`} target="_blank" rel="noreferrer" className="text-xs font-extrabold text-[#1F2022] hover:text-[#C4A265] transition underline decoration-1 underline-offset-4">
                      Facebook: {storeSettings.facebookUrl}
                    </a>
                  )}
                  {storeSettings.xUrl && (
                    <a href={storeSettings.xUrl.startsWith("http") ? storeSettings.xUrl : `https://x.com/${storeSettings.xUrl.replace(/^@/, "").replace(/\s+/g, "")}`} target="_blank" rel="noreferrer" className="text-xs font-extrabold text-[#1F2022] hover:text-[#C4A265] transition underline decoration-1 underline-offset-4">
                      X: {storeSettings.xUrl}
                    </a>
                  )}
                </div>
              </div>

              {/* Navigation Column */}
              <div className="space-y-4 lg:col-span-3">
                <h3 className="text-xl font-extrabold text-[#1F2022]">Navigation</h3>
                <ul className="space-y-3 text-sm font-semibold text-[#1F2022]">
                  <li><Link href="/" className="transition hover:opacity-70">{isAdminLoggedIn ? "Dashboard" : "Home"}</Link></li>
                  <li><Link href="/katalog" className="transition hover:opacity-70">Catalog</Link></li>
                  <li><Link href="/#about" className="transition hover:opacity-70">About</Link></li>
                  <li><Link href={isAdminLoggedIn ? "/admin" : "/login"} className="transition hover:opacity-70">{isAdminLoggedIn ? "Admin Dashboard" : "Login Admin"}</Link></li>
                </ul>
              </div>

              {/* Contact & Location Column */}
              <div className="space-y-5 lg:col-span-3">
                <h3 className="text-xl font-extrabold text-[#1F2022]">Contact & Location</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div title="Location" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E2DC] bg-white text-[#1F2022] shadow-xs cursor-default">
                      <svg className="h-5 w-5 text-[#1F2022]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1F2022] leading-relaxed">{storeSettings.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <div title="Landline" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E2DC] bg-white text-[#1F2022] shadow-xs cursor-default">
                      <svg className="h-5 w-5 text-[#1F2022]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1F2022]">+62 {storeSettings.whatsappNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 border-t border-[#E5E2DC] pt-8 text-center text-xs font-semibold text-[#94908C]">
              &copy; 2026 {storeSettings.storeName}. All rights reserved. {storeSettings.tagline}.
            </div>
          </div>
        </div>

      </footer>
    </div>
  );
}
