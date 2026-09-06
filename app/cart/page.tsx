"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, Check, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { formatPrice } from "@/lib/public-catalog";

type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  color?: string;
  quantity: number;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [waNumber, setWaNumber] = useState("6281234567890");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawCart = localStorage.getItem("cart");
        if (rawCart !== null) {
          const parsed = JSON.parse(rawCart);
          if (Array.isArray(parsed)) {
            const normalized: CartItem[] = parsed.map((item: any, idx: number) => ({
              id: String(item.id ?? item.slug ?? `cart-item-${idx}`),
              name: item.name || "Product",
              slug: item.slug || "product",
              price: Number(item.price) || 0,
              imageUrl: item.imageUrl || "",
              color: item.color || "Black",
              quantity: Number(item.quantity) || 1,
            }));
            setCartItems(normalized);
            // Select all by default
            setSelectedIds(normalized.map((item) => item.id));
          } else {
            setCartItems([]);
            setSelectedIds([]);
          }
        } else {
          setCartItems([]);
          setSelectedIds([]);
        }
      } catch (e) {
        setCartItems([]);
        setSelectedIds([]);
      }

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
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const targetId = String(id);
    const updated = cartItems.map((item) => {
      if (String(item.id) === targetId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const removeItem = (id: string) => {
    const targetId = String(id);
    const updated = cartItems.filter((item) => String(item.id) !== targetId);
    setCartItems(updated);
    setSelectedIds((prev) => prev.filter((itemId) => String(itemId) !== targetId));
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((item) => String(item.id)));
    }
  };

  const toggleSelectItem = (id: string) => {
    const targetId = String(id);
    setSelectedIds((prev) => {
      const exists = prev.some((i) => String(i) === targetId);
      if (exists) {
        return prev.filter((i) => String(i) !== targetId);
      } else {
        return [...prev, targetId];
      }
    });
  };

  const selectedItems = cartItems.filter((item) =>
    selectedIds.some((id) => String(id) === String(item.id))
  );
  const selectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const selectedTotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const hasSelected = selectedIds.length > 0;
  const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;

  const handleOrderWhatsApp = () => {
    if (selectedItems.length === 0) return;
    let message = `Halo SmartCap Studio, saya ingin memesan dari Cart:\n\n`;
    selectedItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} (${item.color || "Default"}) x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
    });
    message += `\nTotal (${selectedCount} Items): ${formatPrice(selectedTotal)}`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <StorefrontShell>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 min-h-[80vh] pb-32">
        {/* Header Bar: Icon-only Back Arrow on Left, Centered Title */}
        <div className="relative flex items-center justify-center mb-6">
          <Link
            href="/katalog"
            aria-label="Kembali ke Katalog"
            title="Kembali ke Katalog"
            className="absolute left-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-none text-[#1B1C1E] hover:bg-black/5 transition cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6 stroke-[2.2]" />
          </Link>
          <h1
            className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-widest text-[#1B1C1E] text-center select-none"
            style={{
              fontFamily: "'Akira Expanded', 'Impact', 'Arial Black', sans-serif",
              fontWeight: 900,
            }}
          >
            YOUR CART
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-none border border-[#DED9CF] bg-[#EFECE6] p-12 text-center space-y-4">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#6E7068]" />
            <p className="text-lg font-black text-[#1B1C1E]">Your Cart is Empty</p>
            <p className="text-xs text-[#6E7068]">Explore our catalog and add items to your cart.</p>
            <div className="pt-2">
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 rounded-none bg-[#353B2D] px-6 py-3 text-xs font-bold text-white uppercase tracking-wider transition hover:bg-[#C4A265] hover:text-[#1B1C1E]"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Sub-Header Banner (Desktop Color Palette matching #DED9CF / #EFECE6) */}
            <div className="flex items-center justify-between bg-[#DED9CF] border border-[#D0CBBF] px-4 py-3 text-sm font-extrabold text-[#1B1C1E] rounded-none shadow-2xs">
              {/* Select All Checkbox + Count */}
              <button
                type="button"
                onClick={toggleSelectAll}
                className="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-none border border-[#1B1C1E] transition ${
                    hasSelected ? "bg-[#353B2D] text-white" : "bg-white text-transparent"
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span className="text-sm font-black">({selectedIds.length})</span>
              </button>

              {/* Right: Total Price */}
              <div className="text-sm font-black text-[#1B1C1E]">
                Total: {formatPrice(selectedTotal)}
              </div>
            </div>

            {/* Cart Item Rows Container (Desktop Color Palette matching #EFECE6) */}
            <div className="bg-[#EFECE6] border border-[#DED9CF] p-4 sm:p-6 space-y-4 rounded-none shadow-2xs">
              {cartItems.map((item) => {
                const isChecked = selectedIds.some((id) => String(id) === String(item.id));
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 sm:gap-4 py-3 border-b border-[#DED9CF] last:border-b-0"
                  >
                    {/* Individual Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleSelectItem(item.id)}
                      aria-label={`Pilih ${item.name}`}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-none border border-[#1B1C1E] transition cursor-pointer"
                    >
                      <div
                        className={`flex h-full w-full items-center justify-center transition ${
                          isChecked ? "bg-[#353B2D] text-white" : "bg-white text-transparent"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    </button>

                    {/* Product Thumbnail */}
                    <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 bg-[#DED9CF]/60 border border-[#DED9CF] rounded-none overflow-hidden flex items-center justify-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Product Info & Quantity Controls */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="font-extrabold uppercase text-[#1B1C1E] text-[11px] sm:text-xs md:text-sm leading-snug break-words">
                        {item.name}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-[#353B2D] mt-0.5">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex h-5 w-5 items-center justify-center rounded-none border border-[#353B2D] text-[#353B2D] hover:bg-[#353B2D] hover:text-white transition cursor-pointer text-xs"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-black px-1 min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex h-5 w-5 items-center justify-center rounded-none border border-[#353B2D] text-[#353B2D] hover:bg-[#353B2D] hover:text-white transition cursor-pointer text-xs"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Trash Icon Button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Hapus ${item.name}`}
                      title="Hapus dari keranjang"
                      className="p-2 text-[#1B1C1E] hover:text-red-600 transition cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-5 w-5 stroke-[2]" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── 1. INLINE ORDER BUTTON (Right under item rows box, 100% visible in page flow) ── */}
            {hasSelected && (
              <div className="mt-6 w-full">
                <button
                  type="button"
                  onClick={handleOrderWhatsApp}
                  className="w-full rounded-none bg-[#353B2D] hover:bg-[#C4A265] hover:text-[#1B1C1E] py-4 text-center text-base font-black uppercase tracking-wider text-white shadow-md transition-all duration-300 cursor-pointer"
                >
                  Order ({selectedCount})
                </button>
              </div>
            )}

            {/* ── 2. FIXED STICKY BOTTOM BAR (Floating at screen bottom edge when scrolling) ── */}
            {hasSelected && (
              <div
                className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#F7F6F2]/95 backdrop-blur-md border-t border-[#DED9CF] p-4 shadow-2xl transition-all duration-300"
                style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999 }}
              >
                <div className="max-w-4xl mx-auto">
                  <button
                    type="button"
                    onClick={handleOrderWhatsApp}
                    className="w-full rounded-none bg-[#353B2D] hover:bg-[#C4A265] hover:text-[#1B1C1E] py-4 text-center text-base font-black uppercase tracking-wider text-white shadow-md transition-all duration-300 cursor-pointer"
                  >
                    Order ({selectedCount})
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </StorefrontShell>
  );
}
