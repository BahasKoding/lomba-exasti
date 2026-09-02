"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { buildOrderWhatsAppUrl, fetchCatalog, formatPrice, type CatalogProduct } from "@/lib/public-catalog";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCatalog();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat detail produk.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const product = useMemo(() => products.find((item) => item.slug === slug), [products, slug]);
  const relatedProducts = useMemo(() => products.filter((item) => item.slug !== slug).slice(0, 3), [products, slug]);

  return (
    <StorefrontShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link href="/#catalog" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke katalog
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-[28px] border border-slate-200 bg-white py-24 text-slate-500">
            <Loader className="mr-2 h-5 w-5 animate-spin" />
            Memuat detail produk...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">{error}</div>
        ) : !product ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8">
            <h1 className="text-2xl font-black text-slate-900">Produk tidak ditemukan</h1>
            <p className="mt-2 text-sm text-slate-600">Slug produk tidak ada di katalog. Cek kembali koleksi yang tersedia.</p>
            <Link href="/#catalog" className={buttonVariants({ variant: "default", className: "mt-6 rounded-xl" })}>
              Lihat koleksi
            </Link>
          </div>
        ) : (
          <>
            <section className="grid gap-8 rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_22px_45px_rgba(15,23,42,0.05)] lg:grid-cols-[0.95fr_1.05fr] lg:p-6">
              <div className="overflow-hidden rounded-[24px] bg-slate-100">
                <img src={product.imageUrl} alt={product.name} className="h-[420px] w-full object-cover lg:h-full" />
              </div>

              <div className="flex flex-col justify-center p-2 lg:p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {product.category ? (
                    <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
                      {product.category}
                    </Badge>
                  ) : null}
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
                    {product.stockCount > 0 ? `${product.stockCount} ready stock` : "Stok habis"}
                  </Badge>
                </div>

                <h1 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{product.name}</h1>
                <p className="mt-4 text-2xl font-black text-slate-900">{formatPrice(product.price)}</p>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">{product.description || "Deskripsi produk akan tampil setelah hasil AI disimpan."}</p>

                {product.material ? (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Material</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{product.material}</p>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={buildOrderWhatsAppUrl(product)}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: "default", size: "lg", className: "gap-2 rounded-xl" })}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Beli via WhatsApp
                  </a>
                  <Link href="/#catalog" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-xl" })}>
                    Lihat koleksi lain
                  </Link>
                </div>
              </div>
            </section>

            {relatedProducts.length > 0 ? (
              <section className="mt-12">
                <h2 className="mb-6 text-2xl font-black tracking-tight text-slate-900">Koleksi lainnya</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedProducts.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </main>
    </StorefrontShell>
  );
}
