import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

const publicProducts = [
  {
    id: 1,
    name: "Topi Baseball Polos",
    material: "Cotton Twill",
    category: "Baseball Cap",
    description: "Topi baseball polos bahan cotton twill berkualitas, cocok untuk gaya kasual sehari-hari.",
    price: "Rp 85.000",
    image: "https://placehold.co/400x400/222/FFF?text=Baseball+Cap",
  },
  {
    id: 2,
    name: "Bucket Hat Vintage",
    material: "Canvas",
    category: "Bucket Hat",
    description: "Bucket hat gaya vintage dengan bahan canvas yang nyaman dan tahan lama untuk kegiatan outdoor.",
    price: "Rp 120.000",
    image: "https://placehold.co/400x400/333/FFF?text=Bucket+Hat",
  },
  {
    id: 3,
    name: "Snapback Premium",
    material: "Polyester",
    category: "Snapback",
    description: "Topi snapback premium yang dapat diatur ukurannya, memberikan tampilan urban dan modern.",
    price: "Rp 150.000",
    image: "https://placehold.co/400x400/444/FFF?text=Snapback",
  },
  {
    id: 4,
    name: "Beanie Rajut Musim Dingin",
    material: "Wool",
    category: "Beanie",
    description: "Beanie rajut tebal dari bahan wool yang hangat, sangat pas untuk cuaca dingin.",
    price: "Rp 95.000",
    image: "https://placehold.co/400x400/555/FFF?text=Beanie",
  },
];

export default function Storefront() {
  const adminWhatsApp = "6281234567890"; // Ganti dengan nomor asli

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">SmartCap Catalog 🧢</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#" className="transition-colors hover:text-foreground/80">Semua</Link>
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
                  <Link href="#" className="transition-colors hover:text-foreground/80">Semua</Link>
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
          <Badge variant="secondary">4 Produk</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {publicProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <Badge variant="outline" className="text-xs">{product.category}</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {product.description}
                </p>
                <div className="font-semibold text-lg">{product.price}</div>
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
