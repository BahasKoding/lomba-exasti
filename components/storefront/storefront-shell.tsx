import Link from "next/link";
import { Menu } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "#all-collection", label: "All Collection" },
  { href: "#catalog", label: "Catalog" },
  { href: "#about", label: "About" },
  { href: "#cart", label: "Cart" },
];

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#1F2022] font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-[#E5E2DC] bg-[#FCFAF7]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-12 w-14 place-items-center rounded-xl bg-[#1F2022] text-xs font-bold uppercase tracking-widest text-[#FCFAF7] shadow-sm">
              LOGO
            </div>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-semibold text-[#1F2022] transition hover:opacity-70">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-[#1F2022] transition hover:opacity-70">
              Login
            </Link>
            <Sheet>
              <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden text-[#1F2022]" })}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#FCFAF7] border-[#E5E2DC]">
                <SheetHeader>
                  <SheetTitle className="text-[#1F2022] font-bold">Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-5 text-base font-semibold text-[#1F2022]">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="hover:opacity-70">
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/login" className="mt-4 inline-block font-bold text-[#1F2022] underline">
                    Login
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-[#E5E2DC] bg-[#FCFAF7]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-[#94908C] sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; 2026 SmartCap Studio. All rights reserved.</p>
          <p className="font-medium text-[#1F2022]">Crown Your Individuality.</p>
        </div>
      </footer>
    </div>
  );
}
