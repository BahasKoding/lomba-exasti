"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

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
    { href: "/about", label: "About" },
    { href: "/cart", label: "Cart" },
  ];

  const isItemActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/katalog") return pathname === "/katalog" || pathname.startsWith("/produk/");
    if (href === "/about") return pathname === "/about";
    return pathname === href;
  };

  const getFormattedPhone = () => {
    const raw = storeSettings.whatsappNumber || "";
    let clean = raw.replace(/\D/g, "");
    if (!clean) return "";
    if (clean.startsWith("62")) {
      const rest = clean.slice(2);
      if (rest.length >= 10) {
        return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
      }
      return `+62 ${rest}`;
    }
    if (clean.startsWith("0")) {
      const rest = clean.slice(1);
      if (rest.length >= 10) {
        return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
      }
      return `+62 ${rest}`;
    }
    return `+62 ${clean}`;
  };

  const getWaLink = () => {
    const raw = storeSettings.whatsappNumber || "6281234567890";
    const clean = raw.replace(/\D/g, "");
    return `https://wa.me/${clean}?text=${encodeURIComponent(storeSettings.inquiryTemplate)}`;
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] font-sans text-[#1B1C1E] flex flex-col justify-between selection:bg-[#C4A265] selection:text-white">
      {/* Header Bar - Sticky Top-0 */}
      <header className="sticky top-0 z-50 w-full border-b border-[#DED9CF] bg-[#F7F6F2]/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center bg-[#353B2D] text-white transition-transform group-hover:scale-105 rounded-full shadow-xs">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white text-white">
                <polygon points="12 5 19 18 5 18" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E]">
                {storeSettings.storeName || "SmartCap Studio"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                    active
                      ? "bg-[#353B2D] text-white"
                      : "text-[#1B1C1E] hover:bg-[#EFECE6] hover:text-[#353B2D]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button & Mobile Sheet Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Only Admin POV Link */}
            <div className="hidden md:block">
              {isAdminLoggedIn ? (
                <Link
                  href="/admin"
                  className="relative inline-flex items-center gap-2 rounded-none border border-[#1F2022] bg-[#1F2022] px-4 py-2 text-xs font-extrabold tracking-wider uppercase text-[#FCFAF7] shadow-xs hover:bg-[#353B2D] transition-colors"
                  title="Direct to Admin POV"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Admin</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-none border border-[#353B2D] bg-[#353B2D] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#C4A265] hover:text-[#1B1C1E] shadow-xs"
                  title="Direct to Admin POV"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Mobile Sheet Drawer Trigger */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-none border border-[#DED9CF] bg-white text-[#1B1C1E] cursor-pointer">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-[#F7F6F2] border-l border-[#DED9CF] p-6 flex flex-col justify-between rounded-none">
                  <div className="space-y-6">
                    <SheetHeader className="text-left border-b border-[#DED9CF] pb-4">
                      <SheetTitle className="font-sans text-sm font-extrabold uppercase tracking-wider text-[#1B1C1E]">
                        Navigation
                      </SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-none ${
                            isItemActive(item.href)
                              ? "bg-[#353B2D] text-white"
                              : "text-[#1B1C1E] hover:bg-[#EFECE6]"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}

                      {/* Admin Button Moved Inside Mobile Sidebar Drawer */}
                      <div className="pt-2 mt-2 border-t border-[#DED9CF]">
                        {isAdminLoggedIn ? (
                          <Link
                            href="/admin"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="relative flex items-center justify-between gap-2 rounded-none border border-[#1F2022] bg-[#1F2022] px-3.5 py-2.5 text-xs font-extrabold tracking-wider uppercase text-[#FCFAF7] shadow-xs hover:bg-[#353B2D] transition-colors"
                            title="Direct to Admin Panel"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                              <span>Admin Panel</span>
                            </div>
                            <span className="text-[10px] text-[#C4A265] uppercase font-mono">Active</span>
                          </Link>
                        ) : (
                          <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-center rounded-none border border-[#353B2D] bg-[#353B2D] px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#C4A265] hover:text-[#1B1C1E] shadow-xs"
                            title="Direct to Admin Login"
                          >
                            Admin Login
                          </Link>
                        )}
                      </div>
                    </nav>
                  </div>
                  <div className="pt-4 border-t border-[#DED9CF]">
                    <a
                      href={getWaLink()}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center rounded-none bg-[#353B2D] py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-[#C4A265] hover:text-[#1B1C1E]"
                    >
                      Contact WA
                    </a>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <div className="flex-1">{children}</div>

      <FloatingCartBadge />

      {/* Footer Section */}
      <footer className="border-t border-[#353B2D] bg-[#242621] text-white shadow-2xl">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

            {/* Col 1: Brand Logo & Tagline */}
            <div className="md:col-span-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#353B2D] border border-white/20 text-white shadow-md">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white text-white">
                    <polygon points="12 5 19 18 5 18" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-sans text-base sm:text-lg font-black uppercase tracking-wider text-white">
                    {storeSettings.storeName || "SmartCap Studio"}
                  </h2>
                  <p className="text-xs text-[#C8C9C4] font-medium">
                    {storeSettings.tagline || "Crown Your Individuality"}
                  </p>
                </div>
              </div>

              <p className="text-xs font-normal leading-relaxed text-[#A0A29C] max-w-sm">
                SmartCap Studio is a premier interactive digital catalog platform curated for premium cap collections.
              </p>

              {/* Social Media Links - Pure Brand Logos without grey background boxes */}
              <div className="flex items-center gap-5 pt-1">
                <a
                  href={getWaLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-center transition-transform hover:scale-110"
                  title="WhatsApp"
                >
                  <svg className="h-6 w-6 text-[#25D366] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.528 5.856L.057 23.885a.5.5 0 0 0 .615.612l6.118-1.604A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.676-.512-5.205-1.405l-.373-.222-3.865 1.013 1.032-3.768-.243-.388A9.965 9.965 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </a>
                {storeSettings.instagramUrl && (
                  <a
                    href={storeSettings.instagramUrl.startsWith("http") ? storeSettings.instagramUrl : `https://instagram.com/${storeSettings.instagramUrl.replace(/^@/, "").replace(/\s+/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-center transition-transform hover:scale-110"
                    title="Instagram"
                  >
                    <svg className="h-6 w-6 text-[#E1306C] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Navigation</h3>
              <ul className="space-y-2.5 text-xs font-normal text-[#C8C9C4]">
                <li><Link href="/" className="hover:text-white transition">{isAdminLoggedIn ? "Dashboard" : "Home"}</Link></li>
                <li><Link href="/katalog" className="hover:text-white transition">Catalog</Link></li>
                <li><Link href="/#about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/cart" className="hover:text-white transition">Cart</Link></li>
                <li><Link href={isAdminLoggedIn ? "/admin" : "/login"} className="hover:text-white transition">{isAdminLoggedIn ? "Admin Panel" : "Admin Login"}</Link></li>
              </ul>
            </div>

            {/* Col 3: Contact & Location */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Contact & Location</h3>
              <div className="space-y-3 text-xs font-normal text-[#C8C9C4]">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-white/10 rounded-none text-white">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <span className="leading-relaxed pt-1">{storeSettings.address}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-white/10 rounded-none text-white">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <span className="whitespace-nowrap">{getFormattedPhone()}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Row */}
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs font-normal text-[#94908C]">
            © 2026 {storeSettings.storeName || "SmartCap Studio"}. All rights reserved. {storeSettings.tagline}.
          </div>
        </div>
      </footer>
    </div>
  );
}
