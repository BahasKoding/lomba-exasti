"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_logged_in", "true");
      document.cookie = "admin_logged_in=true; path=/";
    }
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_logged_in");
      document.cookie = "admin_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    router.push("/login");
  };

  // Central Nav Items: Dashboard (points to /), Catalog, About, Cart
  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/katalog", label: "Catalog" },
    { href: "/#about", label: "About" },
    { href: "/cart", label: "Cart" },
  ];

  // Sidebar Items: "Massal Upload" removed (redundant with Bulk Massal)
  const sidebarItems = [
    { href: "/admin", label: "Bulk Massal" },
    { href: "/admin/review", label: "AI Review" },
    { href: "/admin/settings", label: "Setting" },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans text-[#1F2022] flex flex-col">
      {/* Top Navbar for Admin POV */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E2DC] bg-[#FCFAF7]/95 backdrop-blur-md">
        <div className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-none bg-[#1F2022] text-[#FCFAF7] font-black text-xs uppercase tracking-wider shadow-sm group-hover:scale-105 transition-transform duration-200">
              LOGO
            </div>
          </Link>

          {/* Center: Main Nav Links (Dashboard, Catalog, About, Cart) - Perfectly Centered */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/" && pathname === "/");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-semibold transition-colors duration-200 hover:opacity-75 ${
                    isActive ? "font-extrabold text-[#1F2022]" : "text-[#1F2022]/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Far Right: Admin Role Badge (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admin"
              className="relative inline-flex items-center gap-2 rounded-none border border-[#1F2022] bg-[#1F2022] px-4 py-1.5 text-xs font-extrabold tracking-wide text-[#FCFAF7] shadow-xs hover:scale-105 transition-transform"
            >
              <span className="h-2 w-2 rounded-none bg-emerald-400 animate-pulse"></span>
              <span className="underline underline-offset-4 decoration-2 decoration-white/70">Admin</span>
            </Link>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-none bg-[#1F2022] px-3 py-1 text-xs font-bold text-[#FCFAF7]"
            >
              <span className="h-1.5 w-1.5 rounded-none bg-emerald-400"></span>
              <span>Admin</span>
            </Link>
            <Sheet>
              <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "text-[#1F2022]" })}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="border-[#E5E2DC] bg-[#FCFAF7]">
                <SheetHeader>
                  <SheetTitle className="font-black text-left text-[#1F2022]">SmartCap Admin</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#94908C]">Main Navigation</span>
                    {navItems.map((item) => (
                      <Link key={item.label} href={item.href} className="text-base font-bold text-[#1F2022] hover:opacity-70">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-[#E5E2DC] pt-4 flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#94908C]">Admin Menu</span>
                    {sidebarItems.map((item) => (
                      <Link key={item.label} href={item.href} className="text-sm font-semibold text-[#1F2022] hover:opacity-70">
                        {item.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 mt-2 cursor-pointer">
                      <ArrowLeft className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Layout Workspace */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 gap-10">
        {/* Left Sidebar (Strictly 0 Corner Radius: rounded-none) */}
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-28 flex flex-col gap-2.5 rounded-none border border-[#E5E2DC] bg-[#FCFAF7] p-3 shadow-xs">
            {sidebarItems.map((item, idx) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`group flex items-center rounded-none px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#D8D4CD] text-[#1F2022] font-black shadow-2xs"
                      : "text-[#1F2022]/80 hover:bg-[#E5E2DC]/40 hover:text-[#1F2022]"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="my-2 border-t border-[#E5E2DC]/80"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-none px-4 py-2.5 text-sm font-bold text-red-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}





