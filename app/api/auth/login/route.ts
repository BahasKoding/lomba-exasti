import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    // BUG-BE-003 fix: body yang bukan JSON valid harus 400 terstruktur, bukan 500 SyntaxError
    let body: { email?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Body bukan JSON valid." }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
    }

    // HARDCODED CREDENTIALS
    const HARDCODED_EMAIL = "admin@dev.com";
    const HARDCODED_PASSWORD = "password123";

    if (email !== HARDCODED_EMAIL || password !== HARDCODED_PASSWORD) {
        // pesan sengaja generik
        return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    // BERI GELANG AKSES (cookie session)
    const token = crypto.randomUUID();
    
    const cookieStore = await cookies();
    cookieStore.set("sc_session", token, {
        httpOnly: true,   // JavaScript browser TIDAK bisa baca → anti pencurian via XSS
        sameSite: "lax",  // cookie ikut saat navigasi normal, tidak dikirim situs lain → anti CSRF
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return NextResponse.json({ success: true });
}
