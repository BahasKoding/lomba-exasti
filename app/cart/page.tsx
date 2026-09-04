"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

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

// Initial fallback sample cart products matching the wireframe
const fallbackCartItems: CartItem[] = [
  {
    id: "cart-1",
    name: "Topi Bennie",
    slug: "topi-bennie-1",
    price: 15000,
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
    color: "Black",
    quantity: 1,
  },
  {
    id: "cart-2",
    name: "Topi Bennie",
    slug: "topi-bennie-2",
    price: 15000,
    imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80",
    color: "Black",
    quantity: 1,
  },
  {
    id: "cart-3",
    name: "Topi Bennie",
    slug: "topi-bennie-3",
    price: 15000,
    imageUrl: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=600&q=80",
    color: "Black",
    quantity: 1,
  },
  {
    id: "cart-4",
    name: "Topi Bennie",
    slug: "topi-bennie-4",
    price: 15000,
    imageUrl: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=600&q=80",
    color: "Black",
    quantity: 1,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [waNumber, setWaNumber] = useState("6281234567890");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Read saved cart from localStorage
      try {
        const rawCart = localStorage.getItem("cart");
        if (rawCart) {
          const parsed = JSON.parse(rawCart);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalized: CartItem[] = parsed.map((item: any, idx: number) => ({
              id: item.id || `item-${idx}`,
              name: item.name || "Topi Bennie",
              slug: item.slug || "topi-bennie",
              price: Number(item.price) || 15000,
              imageUrl: item.imageUrl || fallbackCartItems[0].imageUrl,
              color: item.color || "Black",
              quantity: item.quantity || 1,
            }));
            setCartItems(normalized);
          } else {
            setCartItems(fallbackCartItems);
          }
        } else {
          setCartItems(fallbackCartItems);
        }
      } catch (e) {
        setCartItems(fallbackCartItems);
      }

      // Read store whatsapp number from settings
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
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updated));
    }
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updated));
    }
  };

  const totalProductsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const grandTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrderWhatsApp = () => {
    if (cartItems.length === 0) return;
    let message = `Halo SmartCap Studio, saya ingin memesan dari Cart:\n\n`;
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} (${item.color || "Default"}) x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
    });
    message += `\nTotal (${totalProductsCount} Products): ${formatPrice(grandTotal)}`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <StorefrontShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 min-h-[70vh]">
        {/* Page Title: YOUR CART (Akira Expanded Font, rounded-none) */}
        <h1
          className="mb-8 text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-[#1B1C1E]"
          style={{
            fontFamily: "'Akira Expanded', 'Impact', 'Arial Black', sans-serif",
            letterSpacing: "0.20em",
            fontWeight: 900,
          }}
        >
          YOUR CART
        </h1>

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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            {/* Left Side: Product Table Area (Cols 1-8) - Matching Wireframe */}
            <div className="lg:col-span-8 rounded-none border border-[#DED9CF] bg-[#EFECE6] p-4 sm:p-6 shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#DED9CF]/60 text-xs sm:text-sm font-black text-[#1B1C1E] pb-4">
                      <th className="py-3 px-2 w-10 text-center"></th>
                      <th className="py-3 px-2">Product</th>
                      <th className="py-3 px-2 text-center">Price</th>
                      <th className="py-3 px-2 text-center">Qty</th>
                      <th className="py-3 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DED9CF]/50 text-xs sm:text-sm font-semibold text-[#1B1C1E]">
                    {cartItems.map((item) => (
                      <tr key={item.id} className="group transition hover:bg-white/40">
                        {/* Remove 'X' Button */}
                        <td className="py-4 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="font-black text-[#1B1C1E] hover:text-red-600 transition p-1 cursor-pointer text-sm sm:text-base"
                            title="Remove item"
                          >
                            X
                          </button>
                        </td>

                        {/* Product Thumbnail & Details */}
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-none overflow-hidden flex items-center justify-center">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-extrabold uppercase text-[#1B1C1E] text-xs sm:text-sm">
                                {item.name}
                              </p>
                              <p className="text-xs text-[#6E7068] mt-0.5">
                                {item.color || "Black"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-2 text-center font-bold whitespace-nowrap">
                          {formatPrice(item.price)}
                        </td>

                        {/* Qty Stepper */}
                        <td className="py-4 px-2 text-center">
                          <div className="inline-flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-6 w-6 rounded-none border border-[#353B2D] flex items-center justify-center text-[#353B2D] hover:bg-[#353B2D] hover:text-white transition cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-extrabold px-1 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-6 w-6 rounded-none border border-[#353B2D] flex items-center justify-center text-[#353B2D] hover:bg-[#353B2D] hover:text-white transition cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-4 px-2 text-right font-extrabold whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Side: Order Summary Card (Cols 9-12) - Matching Wireframe */}
            <div className="lg:col-span-4 space-y-4">
              {/* Summary Grey Box */}
              <div className="rounded-none border border-[#DED9CF] bg-[#EFECE6] p-6 sm:p-8 space-y-4 shadow-2xs">
                <p className="text-sm font-bold text-[#1B1C1E]">
                  {totalProductsCount} {totalProductsCount === 1 ? "Product" : "Products"}
                </p>
                <p className="text-3xl sm:text-4xl font-black text-[#1B1C1E] tracking-tight">
                  {formatPrice(grandTotal)}
                </p>
              </div>

              {/* Full Width Order Button */}
              <button
                type="button"
                onClick={handleOrderWhatsApp}
                className="w-full rounded-none bg-[#353B2D] hover:bg-[#C4A265] hover:text-[#1B1C1E] py-4 text-center text-sm font-extrabold uppercase tracking-wider text-white shadow-xs transition-all duration-300 cursor-pointer"
              >
                Order
              </button>
            </div>
          </div>
        )}
      </main>
    </StorefrontShell>
  );
}
