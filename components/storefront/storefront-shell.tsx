"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Check if admin is logged in via localStorage or cookie
    const isLogged =
      typeof window !== "undefined" &&
      (localStorage.getItem("admin_logged_in") === "true" ||
        document.cookie.includes("admin_logged_in=true"));
    setIsAdminLoggedIn(!!isLogged);
  }, []);

  const navItems = [
    { href: "/", label: isAdminLoggedIn ? "Dashboard" : "Home" },
    { href: "/katalog", label: "Catalog" },
    { href: "/#about", label: "About" },
    { href: "/#cart", label: "Cart" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCFAF7] via-[#F5F2ED] to-[#E3DFD7] font-sans text-[#1F2022]">
      {/* Header Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E5E2DC] bg-[#FCFAF7]/90 backdrop-blur-md">
        <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Header Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E2DC] bg-white text-[#1F2022] font-black text-sm shadow-xs group-hover:border-[#1F2022] transition-colors">
              SC
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-base font-black uppercase tracking-wider text-[#1F2022] leading-none">
                SMARTCAP
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#94908C] mt-0.5">
                Studio
              </span>
            </div>
          </Link>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative py-1 text-sm font-semibold text-[#1F2022] transition-colors duration-300 hover:opacity-80 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F2022] hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Far Right Action: Admin Badge (if logged in) or Login link */}
          <div className="flex items-center gap-4">
            {isAdminLoggedIn ? (
              <Link
                href="/admin"
                className="relative inline-flex items-center gap-2 rounded-full border border-[#1F2022] bg-[#1F2022] px-4 py-1.5 text-xs font-extrabold tracking-wide text-[#FCFAF7] shadow-xs hover:scale-105 transition-transform"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="underline underline-offset-4 decoration-2 decoration-white/70">Admin</span>
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-[#1F2022] transition hover:opacity-70">
                Login
              </Link>
            )}

            {/* Mobile Sheet Drawer */}
            <Sheet>
              <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden text-[#1F2022]" })}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="border-[#E5E2DC] bg-[#FCFAF7]">
                <SheetHeader>
                  <SheetTitle className="font-bold text-[#1F2022]">Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-5 text-base font-semibold text-[#1F2022]">
                  {navItems.map((item) => (
                    <Link key={item.label} href={item.href} className="hover:opacity-70">
                      {item.label}
                    </Link>
                  ))}
                  {isAdminLoggedIn ? (
                    <Link href="/admin" className="mt-4 inline-flex items-center gap-2 font-bold text-[#1F2022]">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Admin Panel
                    </Link>
                  ) : (
                    <Link href="/login" className="mt-4 inline-block font-bold text-[#1F2022] underline">
                      Login
                    </Link>
                  )}
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
            {/* Left Column: Brand Logo, Description & Social Media Pills */}
            <div className="space-y-6 lg:col-span-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E5E2DC] bg-white text-[#1F2022] font-black text-lg shadow-xs">
                  SC
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-lg font-black uppercase tracking-wider text-[#1F2022] leading-none">
                    SMARTCAP
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94908C] mt-1">
                    Studio Catalog
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[#1F2022]">
                SmartCap Studio is a premier digital catalog platform curated for hat enthusiasts, blending timeless craft with AI-powered ingestion.
              </p>

              {/* Social Media Links - Pure brand logos without white background boxes */}
              <div className="flex items-center gap-6 pt-2">
                {/* WA Link */}
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2.5 text-xs font-bold text-[#1F2022] transition-transform duration-300 hover:scale-105"
                  title="WhatsApp"
                >
                  <svg className="h-5 w-5 text-[#25D366] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  <span className="font-extrabold group-hover:text-[#25D366] transition-colors">WA</span>
                </a>

                {/* Instagram Link */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2.5 text-xs font-bold text-[#1F2022] transition-transform duration-300 hover:scale-105"
                  title="Instagram"
                >
                  <svg className="h-5 w-5 text-[#E1306C] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  <span className="font-extrabold group-hover:text-[#E1306C] transition-colors">Instagram</span>
                </a>
              </div>
            </div>

            {/* Navigation Column */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-xl font-extrabold text-[#1F2022]">Navigation</h3>
              <ul className="space-y-3 text-sm font-semibold text-[#1F2022]">
                <li>
                  <Link href="/" className="transition hover:opacity-70">
                    Home
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
                  <Link href="/login" className="transition hover:opacity-70">
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Category Column */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-xl font-extrabold text-[#1F2022]">Category</h3>
              <ul className="space-y-3 text-sm font-semibold text-[#1F2022]">
                <li>
                  <Link href="/katalog?category=Baseball+Cap" className="transition hover:opacity-70">
                    Baseball Cap
                  </Link>
                </li>
                <li>
                  <Link href="/katalog?category=Trucker+Cap" className="transition hover:opacity-70">
                    Trucker Cap
                  </Link>
                </li>
                <li>
                  <Link href="/katalog?category=Bucket+Hat" className="transition hover:opacity-70">
                    Bucket Hat
                  </Link>
                </li>
                <li>
                  <Link href="/katalog?category=Snapback" className="transition hover:opacity-70">
                    Snapback
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
                    <p className="text-xs font-bold text-[#1F2022]">Jl. Haji Nawir Husadah II</p>
                    <p className="text-xs text-[#94908C]">Jakarta, Indonesia</p>
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
                    <p className="text-xs font-bold text-[#1F2022]">021 9999 9999</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-[#E5E2DC] pt-8 text-center text-xs font-semibold text-[#94908C]">
            &copy; 2026 SmartCap Studio. All rights reserved. Crown Your Individuality.
          </div>
        </div>
      </footer>
    </div>
  );
}

