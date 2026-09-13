import { NextResponse } from "next/server";
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

// "Topi Baseball Merah!" -> "topi-baseball-merah" (a clean web address)
function slugify(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
    const user = await getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    let body: { id?: string; status?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const { id, status } = body;
    // validasi ketat: hanya dua nilai yang diterima — jangan biarkan string aneh masuk DB
    if (!id || (status !== "parked" && status !== "published")) {
        return NextResponse.json({ error: "Fields 'id' and 'status' (parked|published) are required." }, { status: 400 });
    }

    try {
        const updated = await db
            .update(productsTable)
            .set({ status })
            .where(eq(productsTable.id, id))
            .returning();

        if (updated.length === 0) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated[0] });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message ?? "Failed to update product." }, { status: 500 });
    }
}


export async function GET() {
    const user = await getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    try {
        const all = await db.select().from(productsTable);
        return NextResponse.json({ success: true, data: all });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message ?? "Failed to load products." },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    const user = await getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
    }

    let body: {
        products: {
            name: string;
            category: string;
            material: string;
            description: string;
            price: number;
            status: "parked";
            imageBase64?: string; // optional — cards without photos are allowed
            mimeType?: string;
        }[];
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const items = body.products;
    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "Field 'products' must contain at least 1 item." }, { status: 400 });
    }

    for (const item of items) {
        if (
            !item?.name || typeof item.name !== "string" ||
            !item.category || typeof item.category !== "string" ||
            !item.description || typeof item.description !== "string" ||
            typeof item.price !== "number" || !Number.isFinite(item.price) || item.price < 0
        ) {
            return NextResponse.json(
                { error: "Each product must have 'name', 'category', 'description' (string), and 'price' (number >= 0)." },
                { status: 400 },
            );
        }
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
            { success: false, error: err?.message ?? "Failed to save product." },
            { status: 500 },
        );
    }
}


export async function DELETE(request: Request) {
    let body: { id?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const { id } = body;
    if (!id) {
        return NextResponse.json({ error: "Product 'id' is required." }, { status: 400 });
    }

    try {
        const deleted = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
        if (deleted.length === 0) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: deleted[0] });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message ?? "Failed to delete product." }, { status: 500 });
    }
}

