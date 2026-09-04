"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C4A265] bg-[#353B2D] text-white font-black text-sm shadow-xs group-hover:bg-[#C4A265] transition-colors">
              SC
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-base font-black uppercase tracking-wider text-[#1B1C1E] leading-none">
                {storeSettings.storeName.split(" ")[0] || "SMARTCAP"}
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#C4A265] mt-0.5">
                {storeSettings.storeName.split(" ").slice(1).join(" ") || "Studio"}
              </span>
            </div>
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

            {/* Mobile Hamburger Drawer */}
            <Sheet>
              <SheetTrigger className="md:hidden flex h-10 w-10 items-center justify-center rounded-none border border-[#DED9CF] bg-white text-[#1B1C1E] shadow-2xs hover:bg-[#353B2D] hover:text-white hover:border-[#353B2D] transition-all cursor-pointer">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l border-[#DED9CF] bg-[#F7F6F2] p-6">
                <SheetHeader className="text-left border-b border-[#DED9CF] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C4A265] bg-[#353B2D] text-white font-black text-xs">
                      SC
                    </div>
                    <SheetTitle className="font-sans text-base font-black uppercase tracking-wider text-[#1B1C1E]">
                      {storeSettings.storeName}
                    </SheetTitle>
                  </div>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-3 text-base font-bold text-[#1B1C1E]">
                  {navItems.map((item) => {
                    const active = isItemActive(item.href);
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center justify-between rounded-none px-3.5 py-3 transition-all ${
                          active
                            ? "bg-[#353B2D] text-white border-l-4 border-[#C4A265]"
                            : "border border-transparent hover:border-[#DED9CF] hover:bg-white hover:text-[#C4A265]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {active && <span className="h-2 w-2 rounded-full bg-[#C4A265]" />}
                          {item.label}
                        </span>
                        <span className={`text-xs ${active ? "text-[#C4A265]" : "text-[#6E7068]"}`}>→</span>
                      </Link>
                    );
                  })}
                  
                  <div className="mt-6 border-t border-[#DED9CF] pt-6">
                    {isAdminLoggedIn ? (
                      <Link
                        href="/admin"
                        className="flex w-full items-center justify-center gap-2 rounded-none bg-[#353B2D] py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#C4A265] hover:text-[#1B1C1E]"
                      >
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Dashboard Admin
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className={`flex w-full items-center justify-center gap-2 rounded-none py-3.5 text-sm font-extrabold shadow-xs transition ${
                          pathname === "/login"
                            ? "bg-[#353B2D] text-white"
                            : "border border-[#353B2D] bg-white text-[#353B2D] hover:bg-[#353B2D] hover:text-white"
                        }`}
                      >
                        Login Admin
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Footer Section */}
      <footer className="border-t border-[#E5E2DC] bg-transparent">
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

              {/* Social Media Links: WhatsApp with Logo (direct click), other socials as plain text links without logo icons */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                {/* WA Link WITH LOGO ICON (Per user directive) */}
                <a
                  href={getWaLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2.5 text-xs font-bold text-[#1F2022] transition-transform duration-300 hover:scale-105"
                  title="Direct WhatsApp Inquiry"
                >
                  <svg className="h-5 w-5 text-[#25D366] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  <span className="font-extrabold group-hover:text-[#25D366] transition-colors">WhatsApp</span>
                </a>

                {/* Other Social Media URLs: Plain Text Links WITH EXPLICIT PLATFORM NAME (No Logo Icons) */}
                {storeSettings.instagramUrl && (
                  <a
                    href={storeSettings.instagramUrl.startsWith("http") ? storeSettings.instagramUrl : `https://instagram.com/${storeSettings.instagramUrl.replace(/^@/, "").replace(/\s+/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-extrabold text-[#1F2022] hover:text-[#C4A265] transition underline decoration-1 underline-offset-4"
                  >
                    Instagram: {storeSettings.instagramUrl}
                  </a>
                )}

                {storeSettings.tiktokUrl && (
                  <a
                    href={storeSettings.tiktokUrl.startsWith("http") ? storeSettings.tiktokUrl : `https://tiktok.com/@${storeSettings.tiktokUrl.replace(/^@/, "").replace(/\s+/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-extrabold text-[#1F2022] hover:text-[#C4A265] transition underline decoration-1 underline-offset-4"
                  >
                    TikTok: {storeSettings.tiktokUrl}
                  </a>
                )}

                {storeSettings.facebookUrl && (
                  <a
                    href={storeSettings.facebookUrl.startsWith("http") ? storeSettings.facebookUrl : `https://facebook.com/${storeSettings.facebookUrl.replace(/\s+/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-extrabold text-[#1F2022] hover:text-[#C4A265] transition underline decoration-1 underline-offset-4"
                  >
                    Facebook: {storeSettings.facebookUrl}
                  </a>
                )}

                {storeSettings.xUrl && (
                  <a
                    href={storeSettings.xUrl.startsWith("http") ? storeSettings.xUrl : `https://x.com/${storeSettings.xUrl.replace(/^@/, "").replace(/\s+/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-extrabold text-[#1F2022] hover:text-[#C4A265] transition underline decoration-1 underline-offset-4"
                  >
                    X: {storeSettings.xUrl}
                  </a>
                )}
              </div>
            </div>

            {/* Navigation Column */}
            <div className="space-y-4 lg:col-span-3">
              <h3 className="text-xl font-extrabold text-[#1F2022]">Navigation</h3>
              <ul className="space-y-3 text-sm font-semibold text-[#1F2022]">
                <li>
                  <Link href="/" className="transition hover:opacity-70">
                    {isAdminLoggedIn ? "Dashboard" : "Home"}
                  </Link>
                </li>
                <li>
                  <Link href="/katalog" className="transition hover:opacity-70">
                    Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="transition hover:opacity-70">
                    About
                  </Link>
                </li>
                <li>
                  <Link href={isAdminLoggedIn ? "/admin" : "/login"} className="transition hover:opacity-70">
                    {isAdminLoggedIn ? "Admin Dashboard" : "Login Admin"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Location Column */}
            <div className="space-y-5 lg:col-span-3">
              <h3 className="text-xl font-extrabold text-[#1F2022]">Contact & Location</h3>
              <div className="space-y-4">
                {/* Location Item */}
                <div className="flex items-start gap-3.5">
                  <div
                    title="Location"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E2DC] bg-white text-[#1F2022] shadow-xs cursor-default"
                  >
                    <svg className="h-5 w-5 text-[#1F2022]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1F2022] leading-relaxed">{storeSettings.address}</p>
                  </div>
                </div>

                {/* Landline Item (Telepon Rumah) */}
                <div className="flex items-center gap-3.5">
                  <div
                    title="Landline"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E2DC] bg-white text-[#1F2022] shadow-xs cursor-default"
                  >
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
      </footer>
    </div>
  );
}

