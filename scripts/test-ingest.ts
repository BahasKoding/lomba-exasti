import "dotenv/config";
import { readFileSync } from "fs";
import { generateProductDraft } from "../lib/ai";

// first CLI arg = image path, second = product name
const imagePath = process.argv[2];
const productName = process.argv[3] ?? "Topi Baseball";

if (!imagePath) {
    console.error("Usage: npx tsx scripts/test-ingest.ts <image-path> [product-name]");
    process.exit(1);
}

const mimeType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";
const imageBase64 = readFileSync(imagePath).toString("base64");

async function main() {
    console.log(`Testing: "${productName}" (${imagePath})...`);
    const t0 = Date.now();

    try {
        const draft = await generateProductDraft(productName, imageBase64, mimeType);
        console.log(`✅ Success in ${Date.now() - t0}ms`);
        console.log(JSON.stringify(draft, null, 2));
    } catch (err) {
        console.error("❌ FAILED:", err);
        process.exit(1);
    }
}

main();
