"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ArrowLeft, ExternalLink, LogOut, Package, Sparkles, Layers, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("admin_logged_in", "true");
    document.cookie = "admin_logged_in=true; path=/";
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("admin_logged_in");
    document.cookie = "admin_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const sidebarItems = [
    { href: "/admin", label: "Bulk Massal", icon: Layers },
    { href: "/admin/review", label: "AI Review", icon: Sparkles },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/settings", label: "Setting", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF7] font-sans text-[#1F2022] flex flex-col md:flex-row">
      {/* Mobile Top Header (Appears ONLY on Mobile when top navbar is removed) */}
      <div className="md:hidden flex h-16 w-full items-center justify-between border-b border-[#E5E2DC] bg-[#FCFAF7] px-4 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-none bg-[#1F2022] text-white shadow-xs">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white text-white">
              <polygon points="12 5 19 18 5 18" fill="currentColor" />
            </svg>
          </div>
          <span className="font-sans text-sm font-bold text-[#1F2022]">SmartCap Admin</span>
        </Link>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger className="flex h-9 w-9 items-center justify-center rounded-none border border-[#E5E2DC] bg-white text-[#1F2022] cursor-pointer outline-none">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[260px] border-l border-[#E5E2DC] bg-[#FCFAF7] p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <SheetHeader className="text-left border-b border-[#E5E2DC] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-none bg-[#1F2022] text-white shadow-xs">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white text-white">
                      <polygon points="12 5 19 18 5 18" fill="currentColor" />
                    </svg>
                  </div>
                  <SheetTitle className="font-sans text-sm font-bold text-[#1F2022]">
                    SmartCap Studio
                  </SheetTitle>
                </div>
              </SheetHeader>

              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#94908C] px-1">Admin Menu</span>
                <nav className="flex flex-col gap-1.5">
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-none transition-colors ${
                          isActive
                            ? "bg-[#1F2022] text-[#FCFAF7]"
                            : "text-[#1F2022] hover:bg-[#E5E2DC]/40"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#E5E2DC]">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#1F2022]/80 hover:text-[#1F2022]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Storefront</span>
              </Link>
              <button
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleLogout(e);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between border-r border-[#E5E2DC] bg-[#FCFAF7] min-h-screen p-6 sticky top-0 h-screen">
        <div className="space-y-8">
          {/* Brand Header */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-none bg-[#1F2022] text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white text-white">
                <polygon points="12 5 19 18 5 18" fill="currentColor" />
              </svg>
            </div>
            <div>
              <span className="font-sans text-base font-bold text-[#1F2022] block leading-tight">SmartCap Studio</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#94908C]">Admin Panel</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#94908C] px-3">Menu</span>
            <nav className="flex flex-col gap-1.5">
              {sidebarItems.map((item, idx) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-none px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#1F2022] text-[#FCFAF7] font-bold shadow-xs"
                        : "text-[#1F2022]/80 hover:bg-[#E5E2DC]/50 hover:text-[#1F2022]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-2 pt-6 border-t border-[#E5E2DC]">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-[#1F2022]/70 hover:text-[#1F2022] transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Storefront</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 rounded-none px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
