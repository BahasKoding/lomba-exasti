export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  stockCount: number;
  category?: string;
  material?: string;
};

const PLACEHOLDER_IMAGE = "https://placehold.co/800x1000/2a2a2a/f2f2f2?text=SmartCap";

const asRecord = (value: unknown): Record<string, unknown> => (value && typeof value === "object" ? (value as Record<string, unknown>) : {});

const asText = (value: unknown, fallback = "") => (typeof value === "string" && value.trim() ? value.trim() : fallback);

const asNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "produk";

export function normalizeCatalogProduct(raw: unknown, index = 0): CatalogProduct {
  const item = asRecord(raw);
  const name = asText(item.name ?? item.product_name ?? item.title, `Produk ${index + 1}`);
  const slug = asText(item.slug, slugify(name));
  const optionalCategory = asText(item.category ?? item.category_name ?? item.type);
  const optionalMaterial = asText(item.material ?? item.material_name ?? item.fabric);

  return {
    id: asText(item.id ?? item.productId ?? item.product_id, `${slug}-${index}`),
    name,
    slug,
    description: asText(item.AI_description ?? item.ai_description ?? item.description ?? item.generated_description),
    price: asNumber(item.price),
    imageUrl: asText(item.imageUrl ?? item.image_url ?? item.image, PLACEHOLDER_IMAGE),
    stockCount: asNumber(item.stock_count ?? item.stockCount ?? item.stock),
    ...(optionalCategory ? { category: optionalCategory } : {}),
    ...(optionalMaterial ? { material: optionalMaterial } : {}),
  };
}

export async function fetchCatalog(): Promise<CatalogProduct[]> {
  const response = await fetch("/api/catalog", { method: "GET" });
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(result?.error || "Gagal memuat katalog.");
  }

  const rows = Array.isArray(result.data) ? result.data : [];
  return rows.map((item: unknown, index: number) => normalizeCatalogProduct(item, index));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function buildOrderWhatsAppUrl(product: Pick<CatalogProduct, "name" | "price" | "slug">) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const message = `Halo Admin SmartCap, saya ingin memesan:\n\nProduk: ${product.name}\nHarga: ${formatPrice(product.price)}\nKode: ${product.slug}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
