export type ReviewStatus = "Pending" | "Approved" | "Rejected";

export type ReviewItem = {
  id: number;
  name: string;
  category: string;
  material: string;
  description: string;
  status: ReviewStatus;
  createdAt: string;
};

export type UploadResult = {
  success: boolean;
  count: number;
  data: Array<{
    id: number;
    name: string;
    category: string;
    material: string;
    description: string;
    status: ReviewStatus;
    createdAt: string;
  }>;
};

export const mockReviewRows: ReviewItem[] = [
  {
    id: 1,
    name: "Baseball Cap Classic",
    category: "Baseball Cap",
    material: "Cotton Twill",
    description: "Topi baseball dengan bahan cotton twill yang ringan, nyaman dipakai harian, dan cocok untuk tampilan casual modern.",
    status: "Pending",
    createdAt: "2026-09-01",
  },
  {
    id: 2,
    name: "Bucket Hat Urban",
    category: "Bucket Hat",
    material: "Canvas",
    description: "Bucket hat dengan desain vintage dan bahan canvas yang kuat, cocok untuk aktivitas outdoor dan tampilan santai.",
    status: "Approved",
    createdAt: "2026-09-02",
  },
  {
    id: 3,
    name: "Snapback Premium",
    category: "Snapback",
    material: "Polyester",
    description: "Topi snapback premium dengan detail modern, adjustable fit, dan tampilan urban yang stylish untuk daily wear.",
    status: "Pending",
    createdAt: "2026-09-02",
  },
  {
    id: 4,
    name: "Beanie Wool Warm",
    category: "Beanie",
    material: "Wool",
    description: "Beanie rajut hangat dari bahan wool yang nyaman untuk cuaca dingin serta cocok untuk gaya casual outdoor.",
    status: "Rejected",
    createdAt: "2026-09-01",
  },
];

const mockGeneratedItems = (files: File[]): UploadResult["data"] =>
  files.map((file, index) => {
    const cleanName = file.name.split(".")[0].replace(/[-_]+/g, " ") || `Produk ${index + 1}`;
    return {
      id: Date.now() + index,
      name: cleanName,
      category: index % 2 === 0 ? "Baseball Cap" : "Bucket Hat",
      material: index % 3 === 0 ? "Cotton Twill" : index % 3 === 1 ? "Canvas" : "Polyester",
      description: `Hasil generate AI untuk ${cleanName}. Produk ini dirancang dengan tampilan modern, bahan yang nyaman dipakai, dan cocok untuk kebutuhan daily wear maupun aktivitas santai.`,
      status: "Pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };
  });

export function useMockAdminData() {
  return process.env.NEXT_PUBLIC_USE_MOCK_ADMIN === "true";
}

export async function fetchReviewData(): Promise<ReviewItem[]> {
  try {
    const response = await fetch("/api/admin/review", { method: "GET" });

    if (!response.ok) {
      throw new Error("Backend belum tersedia.");
    }

    const result = await response.json();
    const data = Array.isArray(result?.data) ? result.data : [];

    return data.length ? data : mockReviewRows;
  } catch {
    return mockReviewRows;
  }
}

export async function updateReviewStatus(id: number, nextStatus: ReviewStatus): Promise<ReviewItem[]> {
  try {
    const response = await fetch("/api/admin/review", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });

    if (!response.ok) {
      throw new Error("Update API gagal.");
    }

    const result = await response.json();
    const data = Array.isArray(result?.data) ? result.data : [];

    if (data.length) {
      return data as ReviewItem[];
    }
  } catch {
    // fallback mock: update only local UI state by caller when this helper is used
  }

  return mockReviewRows.map((item) => (item.id === id ? { ...item, status: nextStatus } : item));
}

export async function submitUploadFiles(files: File[]): Promise<UploadResult> {
  if (!files.length) {
    return {
      success: false,
      count: 0,
      data: [],
    };
  }

  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload API gagal.");
    }

    const result = await response.json();

    if (result?.success) {
      return {
        success: true,
        count: Number(result.count ?? files.length),
        data: Array.isArray(result.data) ? result.data : mockGeneratedItems(files),
      };
    }
  } catch {
    // fallback mock response, siap diganti backend nanti
  }

  const generated = mockGeneratedItems(files);
  return {
    success: true,
    count: generated.length,
    data: generated,
  };
}
