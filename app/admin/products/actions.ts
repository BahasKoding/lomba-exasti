"use server";

import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
  try {
    await db.delete(productsTable).where(eq(productsTable.id, id));
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function toggleProductStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "published" ? "parked" : "published";
    await db
      .update(productsTable)
      .set({ status: newStatus })
      .where(eq(productsTable.id, id));
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error toggling product status:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}

export async function updateProduct(
  id: string,
  data: {
    name: string;
    slug: string;
    price: number;
    stockCount: number;
    category?: string;
    material?: string;
    aiDescription?: string;
    imageUrl?: string;
  }
) {
  try {
    await db
      .update(productsTable)
      .set(data)
      .where(eq(productsTable.id, id));
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}
