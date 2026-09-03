import { NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
    }

    // cari user berdasarkan email
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
        // pesan sengaja generik — jangan bocorkan "email tidak ada" vs "password salah"
        return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    // bandingkan hasil giling
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    // BERI GELANG AKSES (cookie session)
    const token = crypto.randomUUID();
    await db.update(usersTable).set({ sessionToken: token }).where(eq(usersTable.id, user.id));

    const cookieStore = await cookies();
    cookieStore.set("sc_session", token, {
        httpOnly: true,   // JavaScript browser TIDAK bisa baca → anti pencurian via XSS
        sameSite: "lax",  // cookie ikut saat navigasi normal, tidak dikirim situs lain → anti CSRF
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return NextResponse.json({ success: true });
}
