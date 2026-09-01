import { NextResponse } from "next/server";
import { db } from "@/db";
import { productsTable } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const catalog = await db.select().from(productsTable);

        return NextResponse.json({
            success: true,
            data: catalog
        });

    } catch (error: any) {
        console.error("Database catalog fetch error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to load catalog data." },
            { status: 500 }
        );
    }
}
