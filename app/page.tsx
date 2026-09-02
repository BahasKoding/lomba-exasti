"use client"; // fetches catalog in the browser (useEffect + useState)

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Menu, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  AI_description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
  material: string | null;
}

export default function Storefront() {
  const adminWhatsApp = "6281234567890"; // Ganti dengan nomor asli
  const [products, setProducts] = useState<CatalogProduct[] | null>(null);
  const [error, setError] = useState("");

  // saat halaman dibuka: minta daftar topi dari warehouse
  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
        else throw new Error(data.error);
      })
      .catch((err) => setError(err?.message ?? "Gagal memuat katalog"));
  }, []);

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">SmartCap Catalog 🧢</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80">Semua</Link>
            <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Baseball Cap</Link>
            <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Bucket Hat</Link>
            <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Snapback</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hidden md:block">
              <Button variant="outline" size="sm">Admin Login</Button>
            </Link>
            <Sheet>
              <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8 text-sm font-medium">
                  <Link href="/" className="transition-colors hover:text-foreground/80">Semua</Link>
                  <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Baseball Cap</Link>
                  <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Bucket Hat</Link>
                  <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Snapback</Link>
                  <hr className="my-2" />
                  <Link href="/admin">
                    <Button variant="outline" className="w-full">Admin Login</Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Temukan Topi Favoritmu
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Koleksi topi premium dengan berbagai gaya dan material, cocok untuk melengkapi penampilan harianmu.
        </p>
      </section>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Koleksi Terbaru</h2>
          <Badge variant="secondary">{products?.length ?? 0} Produk</Badge>
        </div>

        {error && <p className="text-destructive text-center py-8">{error}</p>}
        {products === null && !error && (
          <p className="flex items-center justify-center gap-2 text-muted-foreground py-12">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat katalog...
          </p>
        )}
        {products?.length === 0 && (
          <p className="text-muted-foreground text-center py-12">Katalog masih kosong. Unggah produk pertama lewat dashboard admin.</p>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🧢</div>
                  )}
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className="text-xs">{product.category ?? "Topi"}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {product.AI_description ?? "Deskripsi belum tersedia."}
                  </p>
                  <div className="font-semibold text-lg">{formatRupiah(product.price)}</div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <a
                    className={buttonVariants({ variant: "default", className: "w-full gap-2" })}
                    href={`https://wa.me/${adminWhatsApp}?text=Halo%20Admin,%20saya%20ingin%20memesan%20${encodeURIComponent(product.name)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Pesan Sekarang
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SmartCap Catalog. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
