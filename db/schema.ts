import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users Table
export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  sessionToken: text("session_token"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});



// Catalog Tablenya
export const productsTable = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  aiDescription: text("ai_description"),
  price: real("price").notNull(),
  imageUrl: text("image_url"),
  stockCount: integer("stock_count").default(0),
  category: text("category"),
  material: text("material"),
  status: text("status").default("parked").notNull(), // "parked" | "published"
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// export const productVariantsTable = sqliteTable("product_variants", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   productId: text("product_id")
//     .notNull()
//     .references(() => productsTable.id, { onDelete: "cascade" }),
//   sku: text("sku").notNull().unique(),
//   color: text("color").notNull(),
//   sizeOrDiameter: text("size_or_diameter"),
//   stockCount: integer("stock_count").default(0).notNull(),
// });

// export const productFeaturesTable = sqliteTable("product_features", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   productId: text("product_id")
//     .notNull()
//     .references(() => productsTable.id, { onDelete: "cascade" }),
//   feature: text("feature").notNull(),
// });
