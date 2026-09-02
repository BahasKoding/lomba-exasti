import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingCart, Menu, Sparkles, ArrowRight, Star, Check } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

const publicProducts = [
  {
    id: 1,
    name: "Topi Baseball Polos",
    material: "Cotton Twill",
    category: "Baseball Cap",
    description: "Desain minimal dan nyaman untuk daily wear dengan finishing premium.",
    price: "Rp 85.000",
    image: "https://placehold.co/600x700/1f2937/ffffff?text=Baseball+Cap",
  },
  {
    id: 2,
    name: "Bucket Hat Vintage",
    material: "Canvas",
    category: "Bucket Hat",
    description: "Aksen retro yang kuat dengan bahan tahan lama untuk aktivitas outdoor.",
    price: "Rp 120.000",
    image: "https://placehold.co/600x700/374151/ffffff?text=Bucket+Hat",
  },
  {
    id: 3,
    name: "Snapback Premium",
    material: "Polyester",
    category: "Snapback",
    description: "Tampilan urban yang lebih tajam dengan fit yang nyaman di kepala.",
    price: "Rp 150.000",
    image: "https://placehold.co/600x700/111827/ffffff?text=Snapback",
  },
  {
    id: 4,
    name: "Beanie Rajut",
    material: "Wool Blend",
    category: "Beanie",
    description: "Hangat, lembut, dan cocok untuk cuaca dingin maupun style santai.",
    price: "Rp 95.000",
    image: "https://placehold.co/600x700/4b5563/ffffff?text=Beanie",
  },
  {
    id: 5,
    name: "Dad Cap Sporty",
    material: "Mesh",
    category: "Dad Cap",
    description: "Ringan dan breathable untuk aktivitas harian maupun olahraga ringan.",
    price: "Rp 90.000",
    image: "https://placehold.co/600x700/6b7280/ffffff?text=Dad+Cap",
  },
  {
    id: 6,
    name: "Classic Fedora",
    material: "Premium felt",
    category: "Fedora",
    description: "Silhouette elegan untuk tampilan formal dengan sentuhan modern.",
    price: "Rp 180.000",
    image: "https://placehold.co/600x700/9ca3af/1f2937?text=Fedora",
  },
];

const featurePills = ["Premium Material", "Ready Stock", "Fast Response", "Fashionable"];

export default function Storefront() {
  const adminWhatsApp = "6281234567890";

  return (
    <div className="min-h-screen bg-[#f5f1ec] text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-[#f5f1ec]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white">S</div>
            <div>
              <p className="text-lg font-black tracking-tight">SmartCap</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">studio</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#" className="text-sm font-medium text-slate-700 transition hover:text-slate-900">
              Semua
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-500 transition hover:text-slate-900">
              Baseball
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-500 transition hover:text-slate-900">
              Bucket
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-500 transition hover:text-slate-900">
              Snapback
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-500 transition hover:text-slate-900">
              Premium
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/admin" className="hidden md:block">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4 text-sm font-medium">
                  <Link href="#" className="text-slate-700">
                    Semua
                  </Link>
                  <Link href="#" className="text-slate-500">
                    Baseball
                  </Link>
                  <Link href="#" className="text-slate-500">
                    Bucket
                  </Link>
                  <Link href="#" className="text-slate-500">
                    Snapback
                  </Link>
                  <Link href="/admin" className="mt-4">
                    <Button variant="outline" className="w-full">
                      Admin Login
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_22px_45px_rgba(15,23,42,0.05)] sm:p-8">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {featurePills.map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                <Sparkles className="h-3.5 w-3.5" />
                Editorial collection
              </div>

              <h1 className="max-w-xl font-heading text-4xl font-black tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-[4rem]">Discover your next standout cap.</h1>

              <p className="mt-5 max-w-lg text-base text-slate-600 sm:text-lg">Koleksi topi premium dengan sentuhan modern untuk tampilan yang lebih percaya diri, lebih rapi, dan lebih berkelas.</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="#catalog" className={buttonVariants({ variant: "default", size: "lg", className: "gap-2 rounded-xl" })}>
                  Lihat Koleksi
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/admin" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-xl" })}>
                  Admin Review
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-[#1f1d1a] p-4 shadow-[0_30px_50px_rgba(31,29,26,0.18)]">
              <div className="overflow-hidden rounded-[24px] bg-slate-300">
                <img src="https://placehold.co/800x1000/2a2a2a/f2f2f2?text=SmartCap+Hero" alt="SmartCap Hero" className="h-[520px] w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Why choose us</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Built for style and everyday comfort</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                Rated 4.9 by shoppers
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {["Bahan berkualitas dan tahan lama", "Desain modern untuk berbagai gaya", "Proses pemesanan cepat dan nyaman"].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="catalog" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Featured collection</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Best sellers</h2>
            </div>
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]">
              6 Produk
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publicProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative overflow-hidden bg-slate-100">
                  <img src={product.image} alt={product.name} className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute left-3 top-3">
                    <Badge variant="outline" className="rounded-full border-white/70 bg-white/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="px-4 pb-2 pt-4">
                  <CardTitle className="text-lg font-bold tracking-tight text-slate-900">{product.name}</CardTitle>
                </CardHeader>

                <CardContent className="px-4 pb-3">
                  <p className="mb-3 line-clamp-2 text-sm leading-5 text-slate-600">{product.description}</p>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Material</p>
                      <p className="mt-1 text-xs font-medium text-slate-700">{product.material}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Harga</p>
                      <p className="mt-1 text-base font-black text-slate-900">{product.price}</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-4 pb-4 pt-0">
                  <a
                    className={buttonVariants({ variant: "default", className: "w-full gap-2 rounded-xl text-sm" })}
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
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} SmartCap Studio. All rights reserved.</p>
          <p>Premium headwear for modern lifestyle</p>
        </div>
      </footer>
    </div>
  );
}
