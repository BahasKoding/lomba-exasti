import { NextResponse } from "next/server";
import { db } from "@/db";
import { productsTable } from "@/db/schema";

// "Topi Baseball Merah!" -> "topi-baseball-merah" (a clean web address)
function slugify(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    let body: {
        products: {
            name: string;
            category: string;
            material: string;
            description: string;
            price: number;
            imageBase64?: string; // optional — cards without photos are allowed
            mimeType?: string;
        }[];
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Body bukan JSON valid." }, { status: 400 });
    }

    const items = body.products;
    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "Field 'products' wajib berisi minimal 1 item." }, { status: 400 });
    }

    try {
        const rows = items.map((item) => {
            const id = crypto.randomUUID();
            return {
                id,
                name: item.name,
                // short random tail so two hats with the same name don't collide
                slug: `${slugify(item.name)}-${id.slice(0, 6)}`,
                category: item.category,
                material: item.material,
                aiDescription: item.description,
                price: item.price,
                imageUrl: item.imageBase64
                    ? `data:${item.mimeType ?? "image/jpeg"};base64,${item.imageBase64}`
                    : null,
                stockCount: 1,
            };
        });

        const inserted = await db.insert(productsTable).values(rows).returning();

        return NextResponse.json({ success: true, data: inserted }, { status: 201 });
    } catch (err: any) {
        console.error("Insert error:", err);
        return NextResponse.json(
            { success: false, error: err?.message ?? "Gagal menyimpan produk." },
            { status: 500 },
        );
    }
}