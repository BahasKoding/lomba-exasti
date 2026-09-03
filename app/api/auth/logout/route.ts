import { NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    const token = cookieStore.get("sc_session")?.value;

    if (token) {
        // bersihkan gelang dari database
        await db.update(usersTable).set({ sessionToken: null }).where(eq(usersTable.sessionToken, token));
    }

    // hapus cookie dari browser
    cookieStore.delete("sc_session");
    return NextResponse.json({ success: true });
}
