import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

const mockReviewData = [
  {
    id: 1,
    name: "Plain Baseball Cap",
    material: "Cotton Twill",
    category: "Baseball Cap",
    description: "Classic plain baseball cap made from high-quality cotton twill, perfect for everyday casual style.",
    status: "Pending",
    createdAt: "2026-09-01",
  },
  {
    id: 2,
    name: "Vintage Bucket Hat",
    material: "Canvas",
    category: "Bucket Hat",
    description: "Vintage style bucket hat made with durable canvas material, ideal for outdoor activities.",
    status: "Approved",
    createdAt: "2026-09-02",
  },
  {
    id: 3,
    name: "Premium Snapback",
    material: "Polyester",
    category: "Snapback",
    description: "Premium adjustable snapback cap, offering a sleek urban look.",
    status: "Pending",
    createdAt: "2026-09-02",
  },
  {
    id: 4,
    name: "Winter Knit Beanie",
    material: "Wool",
    category: "Beanie",
    description: "Warm thick knitted beanie made from soft wool for cold weather adventures.",
    status: "Rejected",
    createdAt: "2026-09-01",
  },
];

const normalizeReviewData = (payload: any) => {
  const source = payload && typeof payload === "object" ? payload : {};
  const candidates = [source.data, source.items, source.results, source.products, source.records, source.payload, Array.isArray(payload) ? payload : null].filter(Boolean);

  for (const candidate of candidates) {
    if (!candidate) continue;

    if (Array.isArray(candidate)) {
      return candidate.map((item, index) => ({
        id: item?.id ?? item?.productId ?? item?.product_id ?? item?.uuid ?? `${Date.now()}-${index}`,
        name: item?.name ?? item?.product_name ?? item?.title ?? item?.productName ?? `Product ${index + 1}`,
        category: item?.category ?? item?.category_name ?? item?.type ?? item?.productCategory ?? "Uncategorized",
        material: item?.material ?? item?.material_name ?? item?.fabric ?? item?.rawMaterial ?? "Unknown",
        description: item?.description ?? item?.ai_description ?? item?.generated_description ?? item?.summary ?? item?.detail ?? "",
        status: item?.status ?? "Pending",
        createdAt: item?.createdAt ?? item?.created_at ?? new Date().toISOString().slice(0, 10),
      }));
    }

    if (typeof candidate === "object") {
      const nestedEntries = Object.values(candidate).filter(Array.isArray);
      for (const nested of nestedEntries) {
        if (nested.length) {
          return normalizeReviewData(nested);
        }
      }
    }
  }

  return mockReviewData;
};

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
  }

  try {
    const externalEndpoint = process.env.NEXT_PUBLIC_AI_REVIEW_ENDPOINT || process.env.AI_REVIEW_ENDPOINT;

    if (externalEndpoint) {
      const response = await fetch(externalEndpoint, { method: "GET", headers: { Accept: "application/json" } });

      if (!response.ok) {
        throw new Error("AI review endpoint returned an error.");
      }

      const result = await response.json();
      const mappedData = normalizeReviewData(result);

      return NextResponse.json({
        success: true,
        data: mappedData,
      });
    }

    return NextResponse.json({ success: true, data: mockReviewData });
  } catch (error: any) {
    console.error("AI review fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch AI review data.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
  }

  try {
    const payload = await request.json();

    if (!payload || typeof payload.id === "undefined") {
      return NextResponse.json({ success: false, error: "Item ID is required." }, { status: 400 });
    }

    const externalEndpoint = process.env.NEXT_PUBLIC_AI_REVIEW_UPDATE_ENDPOINT || process.env.AI_REVIEW_STATUS_ENDPOINT || process.env.AI_REVIEW_ENDPOINT;

    if (externalEndpoint) {
      const response = await fetch(externalEndpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("AI review update endpoint returned an error.");
      }

      const result = await response.json();
      return NextResponse.json({ success: true, data: result ?? payload });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("AI review update error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update AI review status.",
      },
      { status: 500 },
    );
  }
}
