"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export function FloatingCartBadge() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const calculateCount = () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("cart");
      if (!raw) {
        setCartCount(0);
        return;
      }
      const cart = JSON.parse(raw);
      if (Array.isArray(cart)) {
        const total = cart.reduce(
          (sum: number, item: any) => sum + (Number(item.quantity) || 1),
          0
        );
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    calculateCount();

    const handleCartUpdate = () => {
      calculateCount();
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 500);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  if (pathname === "/cart" || cartCount <= 0) return null;

  return (
    <div
      className={`fixed top-24 left-4 sm:top-28 sm:left-8 z-50 transition-all duration-300 ${
        isBouncing ? "scale-110" : "scale-100"
      }`}
    >
      <Link
        href="/cart"
        aria-label="Lihat Keranjang"
        title={`Keranjang (${cartCount} item)`}
        className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#292A2C] text-white shadow-xl hover:bg-[#353B2D] hover:scale-105 active:scale-95 transition-all duration-300 animate-in zoom-in-75 fade-in duration-300"
      >
        {/* Shopping Bag Icon */}
        <ShoppingBag className="h-6 w-6 stroke-[2] text-white transition-transform duration-300 group-hover:scale-110" />

        {/* Counter Badge at top-right corner of circle icon */}
        <span className="absolute -top-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#8E9089] text-[11px] sm:text-xs font-bold text-white shadow-sm ring-2 ring-[#F7F6F2]">
          {cartCount}
        </span>
      </Link>
    </div>
  );
}
