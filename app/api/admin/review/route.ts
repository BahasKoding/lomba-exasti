import { NextResponse } from "next/server";

const mockReviewData = [
  {
    id: 1,
    name: "Topi Baseball Polos",
    material: "Cotton Twill",
    category: "Baseball Cap",
    description: "Topi baseball polos bahan cotton twill berkualitas, cocok untuk gaya kasual sehari-hari.",
    status: "Pending",
    createdAt: "2026-09-01",
  },
  {
    id: 2,
    name: "Bucket Hat Vintage",
    material: "Canvas",
    category: "Bucket Hat",
    description: "Bucket hat gaya vintage dengan bahan canvas yang nyaman dan tahan lama untuk kegiatan outdoor.",
    status: "Approved",
    createdAt: "2026-09-02",
  },
  {
    id: 3,
    name: "Snapback Premium",
    material: "Polyester",
    category: "Snapback",
    description: "Topi snapback premium yang dapat diatur ukurannya, memberikan tampilan urban dan modern.",
    status: "Pending",
    createdAt: "2026-09-02",
  },
  {
    id: 4,
    name: "Beanie Rajut Musim Dingin",
    material: "Wool",
    category: "Beanie",
    description: "Beanie rajut tebal dari bahan wool yang hangat dan nyaman untuk aktivitas luar ruangan di cuaca dingin.",
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
        name: item?.name ?? item?.product_name ?? item?.title ?? item?.productName ?? `Produk ${index + 1}`,
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
        error: error.message || "Gagal mengambil data review AI.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();

    if (!payload || typeof payload.id === "undefined") {
      return NextResponse.json({ success: false, error: "ID item wajib dikirim." }, { status: 400 });
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
        error: error.message || "Gagal memperbarui status review AI.",
      },
      { status: 500 },
    );
  }
}
