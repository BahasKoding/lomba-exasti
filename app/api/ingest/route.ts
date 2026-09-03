import { NextResponse } from "next/server";
import { generateProductDraft } from "@/lib/ai";

// --- Concurrency-limited pool: N workers share one queue ---
async function mapWithConcurrency<T, R>(
    items: T[],
    limit: number,
    fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let next = 0;
    async function worker() {
        while (next < items.length) {
            const i = next++;
            results[i] = await fn(items[i], i);
        }
    }
    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, worker),
    );
    return results;
}

const MAX_ITEMS = 30;
const MAX_BODY_BYTES = 10 * 1024 * 1024; // 10MB

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    // Guardrail 1: reject oversized payloads before parsing
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
        return NextResponse.json(
            { error: `Payload terlalu besar (maks ${MAX_BODY_BYTES / 1024 / 1024}MB).` },
            { status: 413 },
        );
    }

    // Parse + basic shape validation
    let body: { items?: { name: string; imageBase64: string; mimeType: string }[] };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Body bukan JSON valid." }, { status: 400 });
    }

    const items = body.items;
    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "Field 'items' wajib array berisi minimal 1 item." }, { status: 400 });
    }
    if (items.length > MAX_ITEMS) {
        return NextResponse.json({ error: `Maksimal ${MAX_ITEMS} item per request.` }, { status: 400 });
    }
    // Guardrail 2: validate every item BEFORE burning any API calls
    for (const item of items) {
        if (!item?.name || !item?.imageBase64 || !item?.mimeType) {
            return NextResponse.json(
                { error: "Setiap item wajib punya 'name', 'imageBase64', dan 'mimeType'." },
                { status: 400 },
            );
        }
    }

    // Generate drafts: 4 at a time, one result per item (success OR failure)
    const results = await mapWithConcurrency(items, 4, async (item, i) => {
        try {
            const draft = await generateProductDraft(item.name, item.imageBase64, item.mimeType);
            return { index: i, ok: true, draft };
        } catch (err: any) {
            return { index: i, ok: false, error: err?.message ?? "Generation failed" };
        }
    });

    return NextResponse.json({ success: true, results });
}