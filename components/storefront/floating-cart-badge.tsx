"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export function FloatingCartBadge() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [waNumber, setWaNumber] = useState("6281234567890");

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

    if (typeof window !== "undefined") {
      try {
        const rawSettings = localStorage.getItem("smartcap_store_settings");
        if (rawSettings) {
          const parsed = JSON.parse(rawSettings);
          if (parsed.whatsappNumber) {
            const rawNum = parsed.whatsappNumber.replace(/[^\d]/g, "");
            setWaNumber(rawNum.startsWith("62") ? rawNum : "62" + rawNum.replace(/^0+/, ""));
          }
        }
      } catch (e) {}
    }

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

  if (pathname === "/cart") return null;

  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent("Hello SmartCap Studio, I would like to inquire about your collection.")}`;

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 1. Floating WhatsApp Button "Let's Talk!" */}
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] px-4.5 py-2.5 sm:px-5.5 sm:py-3 text-xs sm:text-sm font-extrabold text-white border border-white/30 shadow-lg hover:shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        title="Chat on WhatsApp"
      >
        <svg className="h-5 w-5 fill-white text-white shrink-0" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.528 5.856L.057 23.885a.5.5 0 0 0 .615.612l6.118-1.604A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.676-.512-5.205-1.405l-.373-.222-3.865 1.013 1.032-3.768-.243-.388A9.965 9.965 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        <span className="whitespace-nowrap">Let's Talk!</span>
      </a>

      {/* 2. Floating Cart Balloon */}
      {cartCount > 0 && (
        <div className={`transition-all duration-300 ${isBouncing ? "scale-110" : "scale-100"}`}>
          <Link
            href="/cart"
            aria-label="View Cart"
            title={`View Cart (${cartCount} items)`}
            className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#292A2C] hover:bg-[#353B2D] text-white border border-white/20 shadow-lg hover:border-[#C4A265]/80 hover:shadow-[0_4px_16px_rgba(196,162,101,0.35)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <ShoppingBag className="h-6 w-6 stroke-[2] text-white transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#C4A265] text-[11px] sm:text-xs font-bold text-[#1B1C1E] shadow-md ring-2 ring-[#292A2C]">
              {cartCount}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
