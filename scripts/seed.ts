import "dotenv/config";
import { db } from "../db";
import { productsTable } from "../db/schema";

const dummyProducts = [
  {
    id: "prod-1",
    name: "Urban Baseball Cap",
    slug: "urban-baseball-cap",
    aiDescription: "Crafted from 100% premium cotton twill, featuring a classic 6-panel silhouette, embroidered eyelets for ventilation, and an adjustable metallic strapback closure for custom day-long comfort.",
    price: 149000,
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    stockCount: 25,
    category: "Baseball Cap",
    material: "Cotton Twill",
  },
  {
    id: "prod-2",
    name: "Classic Bucket Hat",
    slug: "classic-bucket-hat",
    aiDescription: "Engineered from water-repellent canvas fabric, providing full 360-degree shade protection with a soft structured brim and breathable mesh lining.",
    price: 169000,
    imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
    stockCount: 18,
    category: "Bucket Hat",
    material: "Waterproof Canvas",
  },
  {
    id: "prod-3",
    name: "Vintage Snapback",
    slug: "vintage-snapback",
    aiDescription: "Retro corduroy texture combined with structured crown panels and a flat brim for timeless streetwear sophistication.",
    price: 189000,
    imageUrl: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
    stockCount: 12,
    category: "Snapback",
    material: "Corduroy Blend",
  },
  {
    id: "prod-4",
    name: "Minimalist Beanie",
    slug: "minimalist-beanie",
    aiDescription: "Ultra-soft wool knit beanie offering snug elastic warmth and a clean cuffed rib design suited for minimalist aesthetics.",
    price: 129000,
    imageUrl: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80",
    stockCount: 30,
    category: "Beanie",
    material: "Soft Wool Knitted",
  },
  {
    id: "prod-5",
    name: "Trucker Mesh Cap",
    slug: "trucker-mesh-cap",
    aiDescription: "Classic high-crown foam front panel with breathable rear mesh netting and snap closure for effortless outdoor utility.",
    price: 139000,
    imageUrl: "https://images.unsplash.com/photo-1517423568366-8b98471794e0?auto=format&fit=crop&w=800&q=80",
    stockCount: 20,
    category: "Trucker Cap",
    material: "Breathable Mesh",
  },
  {
    id: "prod-6",
    name: "Streetwear Dad Hat",
    slug: "streetwear-dad-hat",
    aiDescription: "Washed denim finish with an unconstructed low-profile fit, pre-curved visor, and antique brass buckle closure.",
    price: 159000,
    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    stockCount: 15,
    category: "Dad Hat",
    material: "Washed Denim",
  },
  {
    id: "prod-7",
    name: "Signature Edition Cap",
    slug: "signature-edition-cap",
    aiDescription: "Limited release SKU crafted with custom woven patch embroidery, premium satin interior lining, and individual serial numbering.",
    price: 249000,
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    stockCount: 5,
    category: "Signature Cap",
    material: "Satin & Twill",
  },
];

async function seed() {
  console.log("🌱 Seeding dummy products into Database...");
  try {
    for (const item of dummyProducts) {
      await db
        .insert(productsTable)
        .values(item)
        .onConflictDoUpdate({
          target: productsTable.id,
          set: {
            name: item.name,
            slug: item.slug,
            aiDescription: item.aiDescription,
            price: item.price,
            imageUrl: item.imageUrl,
            stockCount: item.stockCount,
            category: item.category,
            material: item.material,
          },
        });
    }
    console.log("✅ Successfully seeded 7 dummy products into Database!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
