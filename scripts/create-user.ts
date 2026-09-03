// Bikin akun admin: npx tsx scripts/create-user.ts <nama> <email> <password>
import "dotenv/config";
import { db } from "../db";
import { usersTable } from "../db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
    console.error("Usage: npx tsx scripts/create-user.ts <nama> <email> <password>");
    process.exit(1);
}

async function main() {
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing.length > 0) {
        console.error(`❌ Email ${email} sudah terdaftar.`);
        process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(usersTable).values({ name, email, passwordHash });
    console.log(`✅ Akun dibuat: ${name} <${email}>`);
    process.exit(0);
}

main();

