import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

// Validasi User di DB
export async function getSessionUser() {
    const token = (await cookies()).get("sc_session")?.value;
    if (!token) return null;

    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.sessionToken, token));
    return user ?? null;
}