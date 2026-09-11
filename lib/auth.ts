import { cookies } from "next/headers";

// Validasi User (Hardcoded)
export async function getSessionUser() {
    const token = (await cookies()).get("sc_session")?.value;
    if (!token) return null;

    // Return hardcoded user because we are bypassing the database
    return {
        id: 1,
        name: "Admin",
        email: "admin@dev.com",
    };
}