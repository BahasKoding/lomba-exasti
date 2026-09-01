// src/index.ts
import { db } from "./db";
import { usersTable } from "./db/schema";

async function main() {
    // 1. Insert a new user
    console.log("Inserting a new user...");
    await db.insert(usersTable).values({
        name: "Alex",
        email: "alex@example.com",
    });

    // 2. Fetch all users
    console.log("Fetching users...");
    const users = await db.select().from(usersTable);
    console.log("Users in database:", users);
}

main().catch((err) => {
    console.error("Error executing script:", err);
});
