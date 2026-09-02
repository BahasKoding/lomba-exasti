import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_KEY! });

export interface ProductDraft {
    name: string;
    category: string;
    material: string;
    description: string;   // commercial copy, Bahasa Indonesia
    priceEstimate: number; // IDR
}

const CATEGORIES = ["Baseball Cap", "Bucket Hat", "Snapback", "Beanie", "Trucker Cap", "Dad Hat", "Lainnya"];

async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
    let lastErr: unknown;
    for (let attempt = 0; attempt < tries; attempt++) {
        try {
            return await fn();
        } catch (err: any) {
            lastErr = err;
            // only retry on temporary problems (503/429), not real errors (bad key, bad image)
            const status = err?.status ?? err?.error?.code;
            if (status !== 503 && status !== 429) throw err;
            if (attempt < tries - 1) {
                await new Promise(r => setTimeout(r, 1000 * 2 ** attempt)); // 1s, 2s, 4s
            }
        }
    }
    throw lastErr;
}

export async function generateProductDraft(
    name: string,
    imageBase64: string, // raw base64, no data: prefix
    mimeType: string,
): Promise<ProductDraft> {
    const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                parts: [
                    {
                        text: `Nama produk dari penjual: "${name}". Analisis foto topi ini dan buat entri katalog.
- category: pilih TEPAT SATU dari: ${CATEGORIES.join(", ")}.
- material: bahan utama yang terlihat pada foto, dalam Bahasa Indonesia.
- description: deskripsi komersial persuasif 1-2 kalimat untuk etalase online, dalam Bahasa Indonesia.
- priceEstimate: estimasi harga jual dalam RUPIAH Indonesia, bilangan bulat (contoh: 85000).`,
                    },
                    { inlineData: { data: imageBase64, mimeType } },
                ],
            },
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING, enum: CATEGORIES },
                    material: { type: Type.STRING },
                    description: { type: Type.STRING },
                    priceEstimate: { type: Type.NUMBER },
                },
                required: ["category", "material", "description", "priceEstimate"],
            },
        },
    }));

    const parsed = JSON.parse(response.text ?? "{}") as ProductDraft;
    // safety net: if the model ever ignores the enum, don't let junk into the DB
    parsed.category = CATEGORIES.includes(parsed.category) ? parsed.category : "Lainnya";
    return parsed;
}