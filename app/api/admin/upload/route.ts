import { NextResponse } from "next/server";

const buildAiResult = (fileName: string, index: number) => {
  const cleanName = fileName.split(".")[0].replace(/[-_]+/g, " ");
  const baseName = cleanName || `Produk ${index + 1}`;

  return {
    id: Date.now() + index,
    name: baseName,
    category: index % 2 === 0 ? "Baseball Cap" : "Bucket Hat",
    material: index % 3 === 0 ? "Cotton Twill" : index % 3 === 1 ? "Canvas" : "Polyester",
    description: `Hasil generate AI untuk ${baseName}. Produk ini dirancang dengan tampilan modern, bahan yang nyaman dipakai, dan cocok untuk kebutuhan daily wear maupun aktivitas santai.`,
    status: "Pending",
    createdAt: new Date().toISOString().slice(0, 10),
  };
};

const normalizeUploadData = (payload: any, fallbackFiles: File[]) => {
  const source = payload && typeof payload === "object" ? payload : {};
  const candidates = [source.data, source.items, source.results, source.products, source.generated, source.output, source.payload, source.files, Array.isArray(payload) ? payload : null].filter(Boolean);

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
          return normalizeUploadData(nested, fallbackFiles);
        }
      }
    }
  }

  return fallbackFiles.map((file, index) => buildAiResult(file.name, index));
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((file) => file instanceof File);

    if (!files.length) {
      return NextResponse.json({ success: false, error: "Tidak ada file yang dikirim." }, { status: 400 });
    }

    const externalEndpoint = process.env.NEXT_PUBLIC_AI_UPLOAD_ENDPOINT || process.env.AI_UPLOAD_ENDPOINT;

    if (externalEndpoint) {
      const upstreamResponse = await fetch(externalEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!upstreamResponse.ok) {
        throw new Error("AI endpoint returned an error.");
      }

      const upstreamData = await upstreamResponse.json();
      const normalizedData = normalizeUploadData(upstreamData, files);

      return NextResponse.json({
        success: true,
        count: normalizedData.length,
        data: normalizedData,
      });
    }

    const generatedItems = files.map((file, index) => buildAiResult(file.name, index));

    return NextResponse.json({
      success: true,
      count: generatedItems.length,
      data: generatedItems,
    });
  } catch (error: any) {
    console.error("AI upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal memproses upload AI.",
      },
      { status: 500 },
    );
  }
}
