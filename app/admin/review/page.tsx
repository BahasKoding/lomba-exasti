"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Check, 
  Loader, 
  Search, 
  Maximize2, 
  Pencil,
  ChevronDown,
  X
} from "lucide-react";
import { fetchReviewData, type ReviewStatus } from "@/lib/mock-admin-data";

interface ReviewRow {
  id?: string | number;
  name: string;
  category: string;
  material: string;
  description: string;
  priceEstimate: number;
  imageBase64?: string;
  mimeType?: string;
  status: ReviewStatus;
}

export default function ReviewPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ReviewStatus>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Selection Checklist State
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Lightbox preview popup state
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        setIsLoading(true);
        const raw = sessionStorage.getItem("drafts");

        if (raw) {
          const { items, results } = JSON.parse(raw);
          const good: ReviewRow[] = [];

          results.forEach((r: any, i: number) => {
            if (r.ok) {
              good.push({
                id: i + 1,
                name: items[i].name,
                category: r.draft?.category ?? "Baseball Cap",
                material: r.draft?.material ?? "Cotton Twill",
                description: r.draft?.description ?? "",
                priceEstimate: r.draft?.priceEstimate ?? 150000,
                imageBase64: items[i]?.imageBase64,
                mimeType: items[i]?.mimeType,
                status: "Pending",
              });
            }
          });

          setRows(good);
        } else {
          // Fallback to mock/existing review data
          const fallbackData = await fetchReviewData();
          const mappedFallback: ReviewRow[] = fallbackData.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category ?? "Baseball Cap",
            material: item.material ?? "Cotton Twill",
            description: item.description,
            priceEstimate: 149000,
            status: item.status,
          }));
          setRows(mappedFallback);
        }
      } catch (err: any) {
        setMessage({ text: `Failed to load review data: ${err.message}`, type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    loadDrafts();
  }, []);

  const updateRow = (index: number, field: keyof ReviewRow, value: any) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // Filtered Rows Calculation
  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  // Selection Handlers
  const isAllSelected = useMemo(() => {
    if (filteredRows.length === 0) return false;
    return filteredRows.every((r) => {
      const realIndex = rows.indexOf(r);
      return selectedIndices.includes(realIndex);
    });
  }, [filteredRows, rows, selectedIndices]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const filteredRealIndices = filteredRows.map((r) => rows.indexOf(r));
      setSelectedIndices((prev) => prev.filter((i) => !filteredRealIndices.includes(i)));
    } else {
      const filteredRealIndices = filteredRows.map((r) => rows.indexOf(r));
      const next = new Set([...selectedIndices, ...filteredRealIndices]);
      setSelectedIndices(Array.from(next));
    }
  };

  const toggleSelect = (realIndex: number) => {
    setSelectedIndices((prev) =>
      prev.includes(realIndex) ? prev.filter((i) => i !== realIndex) : [...prev, realIndex]
    );
  };

  // Batch Action: Approve Selected Items
  const handleApproveSelected = () => {
    if (selectedIndices.length === 0) return;
    setRows((prev) =>
      prev.map((row, idx) => (selectedIndices.includes(idx) ? { ...row, status: "Approved" } : row))
    );
    setMessage({
      text: `✓ ${selectedIndices.length} item(s) approved successfully!`,
      type: "success",
    });
  };

  // Batch Action: Save Selected (or All Non-Rejected) Items to Database
  const handleSaveSelected = async () => {
    // Exclude any item marked as Rejected
    const validRows = rows.filter((r) => r.status !== "Rejected");
    const targetRows = selectedIndices.length > 0
      ? validRows.filter((_, idx) => selectedIndices.includes(idx))
      : validRows;

    if (!targetRows.length) {
      setMessage({
        text: "⚠️ No valid products to save. (Rejected items are automatically excluded)",
        type: "error",
      });
      return;
    }
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: targetRows.map((r) => ({
            name: r.name,
            category: r.category || "Baseball Cap",
            material: r.material || "Cotton Twill",
            description: r.description,
            price: r.priceEstimate,
            imageBase64: r.imageBase64,
            mimeType: r.mimeType,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Failed to save products to database.");
      }

      sessionStorage.removeItem("drafts");
      setMessage({
        text: `✓ Successfully saved ${targetRows.length} product(s) to Turso database! Redirecting to catalog...`,
        type: "success",
      });
      setTimeout(() => router.push("/katalog"), 1500);
    } catch (err: any) {
      setMessage({ text: `❌ ${err.message || "An error occurred while saving."}`, type: "error" });
      setIsSaving(false);
    }
  };

  const pendingCount = rows.filter((r) => r.status === "Pending").length;
  const approvedCount = rows.filter((r) => r.status === "Approved").length;

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1F2022]">AI Review</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-[#1F2022]/80">
          Carefully evaluate and fine-tune the AI's curated copy and pricing details to ensure absolute editorial precision before updating your storefront.
        </p>
      </div>

      {/* Stats Summary Bar & View Mode Toggle (Wireframe Header Row) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2">
        <div className="flex items-center gap-6 text-sm font-semibold text-[#1F2022]">
          <span>All Draft: <strong className="font-extrabold">{rows.length}</strong></span>
          <span>Pending: <strong className="font-extrabold">{pendingCount}</strong></span>
          <span>Approved: <strong className="font-extrabold">{approvedCount}</strong></span>
        </div>

        {/* View Mode Switcher Pill */}
        <div className="inline-flex items-center rounded-none border border-[#1F2022] bg-white p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded-none px-5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-[#D8D4CD] text-[#1F2022] font-black"
                : "text-[#1F2022]/70 hover:text-[#1F2022]"
            }`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`rounded-none px-5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-[#D8D4CD] text-[#1F2022] font-black"
                : "text-[#1F2022]/70 hover:text-[#1F2022]"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Notification Message Alerts */}
      {message && (
        <div
          className={`rounded-none border p-4 text-xs font-bold shadow-xs ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Main Wireframe Container (Grey Box Card) */}
      <div className="rounded-none border border-[#E5E2DC] bg-[#D8D4CD]/40 p-5 sm:p-8 space-y-6 shadow-xs">
        {/* Top Control Bar: Select All Checkbox on Left + Dynamic Swap of Approve/Save vs Search/Filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center min-h-[48px]">
          
          {/* Select All Checkbox (Size h-8 w-8 matching per-product card checkbox size!) */}
          <button
            type="button"
            onClick={toggleSelectAll}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 border-[#1F2022] transition-all cursor-pointer shadow-2xs ${
              isAllSelected
                ? "bg-[#1F2022] text-white"
                : "bg-white text-transparent hover:bg-[#FCFAF7]"
            }`}
            title="Select All"
          >
            <Check className="h-4 w-4 stroke-[3]" />
          </button>

          {/* DYNAMIC SWAP: When Checkbox IS Clicked -> Show Approve & Save (Search & Filter Disappear). When NOT Clicked -> Show Search & Filter right next to checkbox! */}
          {selectedIndices.length > 0 ? (
            /* DYNAMIC ACTION BUTTONS (Approve & Save) - Replacing Search & Filter */
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
              <button
                type="button"
                onClick={handleApproveSelected}
                className="h-10 rounded-none border border-[#1F2022] bg-white px-6 text-xs font-extrabold text-[#1F2022] transition-all hover:bg-[#FCFAF7] shadow-2xs cursor-pointer"
              >
                Approve ({selectedIndices.length})
              </button>

              <button
                type="button"
                onClick={handleSaveSelected}
                disabled={isSaving}
                className="flex h-10 items-center gap-2 rounded-none bg-[#05A852] border border-[#048A43] px-7 text-xs font-extrabold text-white transition-all hover:bg-[#048A43] shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>
          ) : (
            /* DEFAULT SEARCH BAR & FILTER DROPDOWN - Located directly next to checkbox when NOT clicked */
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center animate-in fade-in duration-200">
              {/* Search Input */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-4 top-3 h-4 w-4 text-[#94908C]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-10 rounded-none border border-[#E5E2DC] bg-white pl-11 pr-4 text-xs font-semibold text-[#1F2022] placeholder-[#94908C] outline-none transition-colors focus:border-[#1F2022]"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="h-10 appearance-none rounded-none border border-[#1F2022] bg-white pl-5 pr-10 text-xs font-extrabold text-[#1F2022] outline-none cursor-pointer shadow-2xs"
                >
                  <option value="All">Filter: All ({rows.length})</option>
                  <option value="Pending">Filter: Pending ({pendingCount})</option>
                  <option value="Approved">Filter: Approved ({approvedCount})</option>
                  <option value="Rejected">Filter: Rejected ({rows.filter((r) => r.status === "Rejected").length})</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-[#1F2022]" />
              </div>
            </div>
          )}
        </div>

        {/* Content Loading & Empty States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#94908C] space-y-3">
            <Loader className="h-8 w-8 animate-spin text-[#1F2022]" />
            <p className="text-xs font-bold uppercase tracking-wider">Loading AI drafts...</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="rounded-none border border-[#E5E2DC] bg-white p-12 text-center text-sm font-semibold text-[#94908C]">
            No drafts found matching your search/filter criteria.
          </div>
        ) : viewMode === "grid" ? (

          /* ================= WIREFRAME GRID CARD VIEW (Strictly 0 Corner Radius: rounded-none) ================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRows.map((row) => {
              const realIndex = rows.indexOf(row);
              const isChecked = selectedIndices.includes(realIndex);
              const imgSrc = row.imageBase64 ? `data:${row.mimeType};base64,${row.imageBase64}` : null;

              return (
                <div
                  key={realIndex}
                  className={`relative flex flex-col overflow-hidden rounded-none border bg-white p-6 shadow-2xs transition-all space-y-4 ${
                    isChecked ? "border-[#1F2022] ring-2 ring-[#1F2022]/20" : "border-[#E5E2DC]"
                  }`}
                >
                  {/* Top-Left Square Checkbox & Status Selector */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleSelect(realIndex)}
                      className={`flex h-8 w-8 items-center justify-center rounded-none border-2 transition-all cursor-pointer shadow-2xs ${
                        isChecked
                          ? "border-[#1F2022] bg-[#1F2022] text-white"
                          : "border-[#1F2022]/40 bg-white text-transparent hover:border-[#1F2022]"
                      }`}
                      title="Select item"
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                    </button>

                    {/* Status Change Selector Badge */}
                    <button
                      type="button"
                      onClick={() =>
                        updateRow(
                          realIndex,
                          "status",
                          row.status === "Pending" ? "Approved" : row.status === "Approved" ? "Rejected" : "Pending"
                        )
                      }
                      className={`rounded-none px-3 py-1 text-[11px] font-extrabold transition-transform active:scale-95 cursor-pointer ${
                        row.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : row.status === "Rejected"
                          ? "bg-red-100 text-red-800 border border-red-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {row.status}
                    </button>
                  </div>

                  {/* Photo Display Box (Strictly 0 Corner Radius: rounded-none) */}
                  <div className="relative group h-48 w-full overflow-hidden rounded-none border border-[#E5E2DC] bg-[#F5F2ED] flex items-center justify-center">
                    {imgSrc ? (
                      <>
                        <img src={imgSrc} alt={row.name} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setLightbox({ src: imgSrc, title: row.name })}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                        >
                          <Maximize2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-4xl">🧢</span>
                    )}
                  </div>

                  {/* Product Name & Price Editable Row (Wireframe Layout) */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    {/* Product Name Field */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-[#1F2022]">Product Name</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => updateRow(realIndex, "name", e.target.value)}
                          className="w-full border-b border-[#1F2022] bg-transparent pb-1 pr-6 text-xs font-bold text-[#1F2022] outline-none focus:border-b-2"
                        />
                        <Pencil className="pointer-events-none absolute right-0 bottom-1.5 h-3.5 w-3.5 text-[#1F2022]/60" />
                      </div>
                    </div>

                    {/* Price Field */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-[#1F2022]">Price</label>
                      <div className="flex items-center gap-1 border-b border-[#1F2022] pb-1">
                        <span className="text-xs font-bold text-[#1F2022]">Rp.</span>
                        <input
                          type="number"
                          value={row.priceEstimate}
                          onChange={(e) => updateRow(realIndex, "priceEstimate", Number(e.target.value))}
                          className="w-full bg-transparent text-xs font-extrabold text-[#1F2022] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description Box (Strictly 0 Corner Radius: rounded-none) */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-bold text-[#1F2022]">Description</label>
                    <textarea
                      value={row.description}
                      onChange={(e) => updateRow(realIndex, "description", e.target.value)}
                      rows={4}
                      className="w-full rounded-none border border-[#1F2022] bg-white p-3.5 text-xs text-[#1F2022] leading-relaxed outline-none focus:ring-1 focus:ring-[#1F2022] resize-y font-normal"
                      placeholder="AI generated description..."
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (

          /* ================= WIREFRAME TABLE CARD VIEW (Strictly 0 Corner Radius: rounded-none) ================= */
          <div className="space-y-4">
            {filteredRows.map((row) => {
              const realIndex = rows.indexOf(row);
              const isChecked = selectedIndices.includes(realIndex);
              const imgSrc = row.imageBase64 ? `data:${row.mimeType};base64,${row.imageBase64}` : null;

              return (
                <div key={realIndex} className="flex items-center gap-4">
                  {/* Left Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleSelect(realIndex)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 transition-all cursor-pointer shadow-2xs ${
                      isChecked
                        ? "border-[#1F2022] bg-[#1F2022] text-white"
                        : "border-[#1F2022]/40 bg-white text-transparent hover:border-[#1F2022]"
                    }`}
                    title="Select item"
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                  </button>

                  {/* Main Horizontal Card Container (Strictly 0 Corner Radius: rounded-none) */}
                  <div
                    className={`flex flex-col md:flex-row items-stretch gap-6 flex-1 rounded-none border bg-white p-6 shadow-2xs transition-all ${
                      isChecked ? "border-[#1F2022] ring-2 ring-[#1F2022]/20" : "border-[#E5E2DC]"
                    }`}
                  >
                    {/* Left Square Thumbnail */}
                    <div className="relative group h-28 w-28 shrink-0 overflow-hidden rounded-none border border-[#E5E2DC] bg-[#F5F2ED] flex items-center justify-center">
                      {imgSrc ? (
                        <>
                          <img src={imgSrc} alt={row.name} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setLightbox({ src: imgSrc, title: row.name })}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                          >
                            <Maximize2 className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-3xl">🧢</span>
                      )}
                    </div>

                    {/* Middle Info Column: Name & Price */}
                    <div className="w-full md:w-64 space-y-4 flex flex-col justify-between">
                      {/* Product Name */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-[#1F2022]">Product Name</label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => updateRow(realIndex, "name", e.target.value)}
                            className="w-full border-b border-[#1F2022] bg-transparent pb-1 pr-6 text-xs font-bold text-[#1F2022] outline-none focus:border-b-2"
                          />
                          <Pencil className="pointer-events-none absolute right-0 bottom-1.5 h-3.5 w-3.5 text-[#1F2022]/60" />
                        </div>
                      </div>

                      {/* Price */}
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-[#1F2022]">Price</label>
                        <div className="flex items-center gap-1 border-b border-[#1F2022] pb-1">
                          <span className="text-xs font-bold text-[#1F2022]">Rp.</span>
                          <input
                            type="number"
                            value={row.priceEstimate}
                            onChange={(e) => updateRow(realIndex, "priceEstimate", Number(e.target.value))}
                            className="w-full bg-transparent text-xs font-extrabold text-[#1F2022] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Description & Status */}
                    <div className="flex-1 space-y-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-[#1F2022]">Description</label>
                        
                        {/* Status Badge */}
                        <button
                          type="button"
                          onClick={() =>
                            updateRow(
                              realIndex,
                              "status",
                              row.status === "Pending" ? "Approved" : row.status === "Approved" ? "Rejected" : "Pending"
                            )
                          }
                          className={`rounded-none px-3 py-1 text-[11px] font-extrabold transition-transform active:scale-95 cursor-pointer ${
                            row.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : row.status === "Rejected"
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          {row.status}
                        </button>
                      </div>

                      <textarea
                        value={row.description}
                        onChange={(e) => updateRow(realIndex, "description", e.target.value)}
                        rows={3}
                        className="w-full rounded-none border border-[#1F2022] bg-white p-3 text-xs text-[#1F2022] leading-relaxed outline-none focus:ring-1 focus:ring-[#1F2022] resize-y font-normal"
                        placeholder="AI generated description..."
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Preview Popup (Strictly 0 Corner Radius: rounded-none) */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl overflow-hidden rounded-none border border-[#E5E2DC] bg-[#141517] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#2A2C30] pb-3">
              <h3 className="font-extrabold text-sm text-[#FCFAF7] truncate">{lightbox.title}</h3>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="rounded-none bg-[#222428] p-1.5 text-[#94908C] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-center max-h-[70vh] overflow-hidden rounded-none bg-black p-2">
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="max-h-[70vh] w-auto object-contain rounded-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}