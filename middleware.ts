import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/admin"];

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.has("sc_session");
    const isProtected = PROTECTED.some((p) => request.nextUrl.pathname.startsWith(p));

    if (isProtected && !isLoggedIn) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", request.nextUrl.pathname); // ingat mau ke mana
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
