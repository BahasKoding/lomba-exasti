"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Check, 
  Loader, 
  Search, 
  Maximize2, 
  Pencil,
  ChevronDown,
  X,
  MoreVertical
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
  createdAt?: string;
}

export default function ReviewPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>("Pending");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Selection Checklist State
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Dynamic Date Dropdown & Selection State
  const [selectedDate, setSelectedDate] = useState<string>("All");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [isStatusFilterDropdownOpen, setIsStatusFilterDropdownOpen] = useState(false);

  // Status Dropdown open state for product cards
  const [openStatusIndex, setOpenStatusIndex] = useState<number | null>(null);

  // Close Dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDateDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setIsStatusFilterDropdownOpen(false);
      }
      const target = e.target as HTMLElement;
      if (!target.closest(".status-dropdown-container")) {
        setOpenStatusIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Extract all unique upload dates from rows (formatted as DD/MM/YYYY)
  const availableDates = useMemo(() => {
    const datesSet = new Set<string>();
    rows.forEach((r) => {
      if (r.createdAt) {
        const d = new Date(r.createdAt);
        if (!isNaN(d.getTime())) {
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          datesSet.add(`${day}/${month}/${year}`);
        }
      }
    });

    const list = Array.from(datesSet);
    if (list.length === 0) {
      const today = new Date();
      const todayStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
      list.push(todayStr);
    }
    return list;
  }, [rows]);

  // Lightbox preview popup state
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        setIsLoading(true);
        const raw = sessionStorage.getItem("drafts");

        if (raw) {
          const { items, results, createdAt } = JSON.parse(raw);
          if (createdAt) {
            const d = new Date(createdAt);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            setSelectedDate(`${day}/${month}/${year}`);
          }
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
                createdAt: createdAt || new Date().toISOString(),
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
            status: "Pending",
            createdAt: new Date().toISOString(),
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
      const matchesStatus = item.status === statusFilter;
      
      let matchesDate = true;
      if (selectedDate !== "All" && item.createdAt) {
        const d = new Date(item.createdAt);
        if (!isNaN(d.getTime())) {
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          const itemDateStr = `${day}/${month}/${year}`;
          matchesDate = itemDateStr === selectedDate;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [rows, search, statusFilter, selectedDate]);

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
    const count = selectedIndices.length;
    setRows((prev) =>
      prev.map((row, idx) => (selectedIndices.includes(idx) ? { ...row, status: "Approved" } : row))
    );
    setSelectedIndices([]);
    setMessage({
      text: `✓ ${count} item(s) approved successfully!`,
      type: "success",
    });
  };

  // Batch Action: Reject Selected Items
  const handleRejectSelected = () => {
    if (selectedIndices.length === 0) return;
    const count = selectedIndices.length;
    setRows((prev) =>
      prev.map((row, idx) => (selectedIndices.includes(idx) ? { ...row, status: "Rejected" } : row))
    );
    setSelectedIndices([]);
    setMessage({
      text: `✓ ${count} item(s) rejected.`,
      type: "success",
    });
  };

  // Batch Action: Move Selected Items to Pending
  const handlePendingSelected = () => {
    if (selectedIndices.length === 0) return;
    const count = selectedIndices.length;
    setRows((prev) =>
      prev.map((row, idx) => (selectedIndices.includes(idx) ? { ...row, status: "Pending" } : row))
    );
    setSelectedIndices([]);
    setMessage({
      text: `✓ ${count} item(s) moved back to Pending.`,
      type: "success",
    });
  };

  // Batch Action: Save Selected (or All Non-Rejected) Items to Database
  const handleSaveSelected = async () => {
    // Exclude any item marked as Rejected, and filter by selectedIndices if items are explicitly checked
    const targetRows = rows.filter((row, idx) => {
      if (row.status === "Rejected") return false;
      if (selectedIndices.length > 0) {
        return selectedIndices.includes(idx);
      }
      return true;
    });

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

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1F2022]">AI Review</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-[#1F2022]/80">
          Carefully evaluate and fine-tune the AI's curated copy and pricing details to ensure absolute editorial precision before updating your storefront.
        </p>
      </div>

      {/* View Mode Switcher Pill Row (Desktop Only) */}
      <div className="hidden md:flex justify-end py-2">
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
        {/* Top Control Bar & Filter Tabs directly matching wireframe */}
        <div className="space-y-4">
          <div className={`flex gap-3 min-h-[48px] ${selectedIndices.length === 0 ? "items-center flex-row" : "flex-col"}`}>
            {/* Select All Checkbox */}
            <button
              type="button"
              onClick={toggleSelectAll}
              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-none border-2 border-[#1F2022] transition-all cursor-pointer shadow-2xs ${
                isAllSelected
                  ? "bg-[#1F2022] text-white"
                  : "bg-white text-transparent hover:bg-[#FCFAF7]"
              }`}
              title="Select All"
            >
              <Check className="h-3 w-3 stroke-[3]" />
            </button>

            {selectedIndices.length > 0 ? (
              /* DYNAMIC ACTION BUTTONS (Context-aware based on active statusFilter) */
              <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
                {statusFilter === "Pending" && (
                  <>
                    <button
                      type="button"
                      onClick={handleApproveSelected}
                      className="flex h-10 w-28 items-center justify-center rounded-none bg-white text-xs font-extrabold text-[#1F2022] transition-all hover:bg-[#FCFAF7] shadow-2xs cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={handleRejectSelected}
                      className="flex h-10 w-28 items-center justify-center rounded-none bg-white text-xs font-extrabold text-[#1F2022] transition-all hover:bg-[#FCFAF7] shadow-2xs cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                )}

                {statusFilter === "Approved" && (
                  <>
                    <button
                      type="button"
                      onClick={handlePendingSelected}
                      className="flex h-10 w-28 items-center justify-center rounded-none bg-white text-xs font-extrabold text-[#1F2022] transition-all hover:bg-[#FCFAF7] shadow-2xs cursor-pointer"
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      onClick={handleRejectSelected}
                      className="flex h-10 w-28 items-center justify-center rounded-none bg-white text-xs font-extrabold text-[#1F2022] transition-all hover:bg-[#FCFAF7] shadow-2xs cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSelected}
                      disabled={isSaving}
                      className="flex h-10 w-28 items-center justify-center gap-2 rounded-none bg-[#05A852] text-xs font-extrabold text-white transition-all hover:bg-[#048A43] shadow-md cursor-pointer disabled:opacity-50"
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
                  </>
                )}

                {statusFilter === "Rejected" && (
                  <>
                    <button
                      type="button"
                      onClick={handleApproveSelected}
                      className="flex h-10 w-28 items-center justify-center rounded-none bg-white text-xs font-extrabold text-[#1F2022] transition-all hover:bg-[#FCFAF7] shadow-2xs cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={handlePendingSelected}
                      className="flex h-10 w-28 items-center justify-center rounded-none bg-white text-xs font-extrabold text-[#1F2022] transition-all hover:bg-[#FCFAF7] shadow-2xs cursor-pointer"
                    >
                      Pending
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* SEARCH BAR, DATE PICKER & 3-DOTS MENU (Matches Wireframe 100%) */
              <div className="flex flex-1 items-center gap-2 animate-in fade-in duration-200">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[100px]">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#94908C]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="w-full h-8 rounded-none border border-[#E5E2DC] bg-white pl-9 pr-3 text-[10px] sm:text-xs font-semibold text-[#1F2022] placeholder-[#94908C] outline-none transition-colors focus:border-[#1F2022]"
                  />
                </div>

                {/* Interactive Date Dropdown Button */}
                <div ref={dropdownRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsDateDropdownOpen((prev) => !prev)}
                    className="flex h-8 items-center justify-between gap-2 rounded-none border border-transparent bg-white px-3 text-[10px] sm:text-xs font-extrabold text-[#1F2022] cursor-pointer hover:bg-[#FCFAF7] whitespace-nowrap"
                  >
                    <span>{selectedDate === "All" ? "Semua Tanggal" : selectedDate}</span>
                  </button>

                  {/* Dropdown Popover List */}
                  {isDateDropdownOpen && (
                    <div className="absolute right-0 top-10 z-50 min-w-[180px] rounded-none border border-[#1F2022] bg-white shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate("All");
                          setIsDateDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-[#FCFAF7] cursor-pointer flex items-center justify-between ${
                          selectedDate === "All" ? "bg-[#D8D4CD] text-[#1F2022] font-black" : "text-[#1F2022]"
                        }`}
                      >
                        <span>Semua Tanggal</span>
                        <span className="text-[10px] opacity-70">({rows.length})</span>
                      </button>

                      {availableDates.map((dateStr) => {
                        const countForDate = rows.filter((r) => {
                          if (!r.createdAt) return false;
                          const d = new Date(r.createdAt);
                          const day = String(d.getDate()).padStart(2, "0");
                          const month = String(d.getMonth() + 1).padStart(2, "0");
                          const year = d.getFullYear();
                          return `${day}/${month}/${year}` === dateStr;
                        }).length;

                        return (
                          <button
                            key={dateStr}
                            type="button"
                            onClick={() => {
                              setSelectedDate(dateStr);
                              setIsDateDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-[#FCFAF7] cursor-pointer flex items-center justify-between ${
                              selectedDate === dateStr ? "bg-[#D8D4CD] text-[#1F2022] font-black" : "text-[#1F2022]"
                            }`}
                          >
                            <span>{dateStr}</span>
                            <span className="text-[10px] opacity-70">({countForDate})</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3-Dots Menu for Status Filter */}
                <div ref={statusDropdownRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsStatusFilterDropdownOpen((prev) => !prev)}
                    className="flex h-8 w-8 items-center justify-center rounded-none text-[#1F2022] hover:bg-[#E5E2DC] transition-colors cursor-pointer"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  
                  {isStatusFilterDropdownOpen && (
                    <div className="absolute right-0 top-10 z-50 min-w-[120px] rounded-none border border-[#1F2022] bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150">
                      {(["Pending", "Approved", "Rejected"] as ReviewStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setStatusFilter(st);
                            setIsStatusFilterDropdownOpen(false);
                          }}
                          className={`w-full text-center px-4 py-2 text-[10px] sm:text-xs font-bold border-b border-[#E5E2DC] last:border-0 transition-colors cursor-pointer ${
                            statusFilter === st ? "bg-[#E5E2DC] text-[#1F2022]" : "text-[#1F2022] hover:bg-[#FCFAF7]"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

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
        ) : (
          <>
            {/* ================= WIREFRAME MOBILE ONLY LIST VIEW ================= */}
            <div className="md:hidden space-y-3">
              {filteredRows.map((row) => {
                const realIndex = rows.indexOf(row);
                const isChecked = selectedIndices.includes(realIndex);
                const imgSrc = row.imageBase64 ? `data:${row.mimeType};base64,${row.imageBase64}` : null;

                return (
                  <div key={realIndex} className="relative mt-2 bg-transparent">
                    {/* Floating Checkbox (Top Left) */}
                    <div className="absolute -left-2 -top-2 z-10 bg-white">
                       <button
                          type="button"
                          onClick={() => toggleSelect(realIndex)}
                          className={`flex h-5 w-5 items-center justify-center rounded-none border border-[#1F2022] transition-all cursor-pointer ${
                            isChecked
                              ? "bg-[#1F2022] text-white"
                              : "bg-white text-transparent hover:bg-[#FCFAF7]"
                          }`}
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </button>
                    </div>

                    <div className={`flex flex-col rounded-none bg-white p-3 pt-5 border border-[#1F2022] ${
                      isChecked ? "shadow-sm ring-1 ring-[#1F2022]/10" : ""
                    }`}>
                      {/* Top Section: Photo + Info Fields */}
                      <div className="flex gap-3 relative">
                         {/* Photo Box */}
                         <div className="relative h-[90px] w-[80px] shrink-0 bg-[#94908C]">
                           {imgSrc ? (
                             <img src={imgSrc} alt={row.name} className="h-full w-full object-cover" />
                           ) : null}
                         </div>
                         
                         {/* Fields */}
                         <div className="flex-1 flex flex-col justify-between">
                           <div className="flex gap-2 w-full">
                             {/* Product Name */}
                             <div className="w-[100px] shrink-0 space-y-0.5">
                               <label className="block text-[9px] font-bold text-[#1F2022]">Product Name</label>
                               <div className="relative flex items-center">
                                 <input
                                   type="text"
                                   value={row.name}
                                   onChange={(e) => updateRow(realIndex, "name", e.target.value)}
                                   className="w-full border-b border-[#1F2022] bg-transparent pb-0.5 pr-4 text-[10px] font-bold text-[#1F2022] outline-none"
                                 />
                                 <Pencil className="absolute right-0 bottom-1 h-2.5 w-2.5 text-[#1F2022]/60" />
                               </div>
                             </div>
                             {/* Price */}
                             <div className="flex-1 space-y-0.5 min-w-[70px]">
                               <label className="block text-[9px] font-bold text-[#1F2022]">Price</label>
                               <div className="flex items-center gap-1 border-b border-[#1F2022] pb-0.5">
                                 <span className="text-[10px] font-bold text-[#1F2022]">Rp.</span>
                                 <input
                                   type="number"
                                   value={row.priceEstimate}
                                   onChange={(e) => updateRow(realIndex, "priceEstimate", Number(e.target.value))}
                                   className="w-full bg-transparent text-[10px] font-bold text-[#1F2022] outline-none"
                                 />
                               </div>
                             </div>
                           </div>
                           
                           {/* Description Label & Status Badge */}
                           <div className="flex justify-between items-end mt-1">
                              <label className="block text-[9px] font-bold text-[#1F2022]">Description</label>
                              
                              {/* Status Badge Dropdown */}
                              <div className="relative status-dropdown-container">
                                <button
                                  type="button"
                                  onClick={() => setOpenStatusIndex(openStatusIndex === realIndex ? null : realIndex)}
                                  className={`flex items-center justify-center rounded-xl px-2 py-0.5 text-[9px] font-bold transition-transform cursor-pointer ${
                                    row.status === "Approved"
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                      : row.status === "Rejected"
                                      ? "bg-red-100 text-red-800 border border-red-300"
                                      : "bg-[#F3D78E] text-[#B8871E] border border-[#E9BA45]"
                                  }`}
                                >
                                  {row.status}
                                </button>
                                
                                {openStatusIndex === realIndex && (
                                  <div className="absolute right-0 top-full mt-1 z-50 min-w-[100px] rounded-none border border-[#1F2022] bg-white shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150">
                                    {(["Pending", "Approved", "Rejected"] as ReviewStatus[]).map((statusOption) => (
                                      <button
                                        key={statusOption}
                                        type="button"
                                        onClick={() => {
                                          updateRow(realIndex, "status", statusOption);
                                          setOpenStatusIndex(null);
                                        }}
                                        className={`w-full text-left px-2 py-1 text-[9px] font-extrabold transition-colors cursor-pointer flex items-center justify-between ${
                                          row.status === statusOption
                                            ? "bg-[#D8D4CD] text-[#1F2022] font-black"
                                            : statusOption === "Approved"
                                            ? "text-emerald-800 hover:bg-emerald-50"
                                            : statusOption === "Rejected"
                                            ? "text-red-800 hover:bg-red-50"
                                            : "text-amber-800 hover:bg-amber-50"
                                        }`}
                                      >
                                        <span>{statusOption}</span>
                                        {row.status === statusOption && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                           </div>
                         </div>
                      </div>

                      {/* Description Box */}
                      <div className="mt-1">
                        <textarea
                          value={row.description}
                          onChange={(e) => updateRow(realIndex, "description", e.target.value)}
                          rows={3}
                          className="w-full rounded-none border border-[#1F2022] bg-white p-2 text-[10px] text-[#1F2022] leading-relaxed outline-none focus:ring-1 focus:ring-[#1F2022] resize-none font-normal"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= DESKTOP VIEWS (Grid / Table) ================= */}
            <div className="hidden md:block">
              {viewMode === "grid" ? (
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
                      className={`flex h-4 w-4 items-center justify-center rounded-none border-2 transition-all cursor-pointer shadow-2xs ${
                        isChecked
                          ? "border-[#1F2022] bg-[#1F2022] text-white"
                          : "border-[#1F2022]/40 bg-white text-transparent hover:border-[#1F2022]"
                      }`}
                      title="Select item"
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                    </button>

                    {/* Status Change Selector Dropdown */}
                    <div className="relative status-dropdown-container">
                      <button
                        type="button"
                        onClick={() => setOpenStatusIndex(openStatusIndex === realIndex ? null : realIndex)}
                        className={`flex items-center gap-1.5 rounded-none px-3 py-1 text-[11px] font-extrabold transition-transform active:scale-95 cursor-pointer shadow-2xs ${
                          row.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                            : row.status === "Rejected"
                            ? "bg-red-100 text-red-800 border border-red-300 hover:bg-red-200"
                            : "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                        }`}
                      >
                        <span>{row.status}</span>
                        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openStatusIndex === realIndex ? "rotate-180" : ""}`} />
                      </button>

                      {openStatusIndex === realIndex && (
                        <div className="absolute right-0 top-full mt-1 z-50 min-w-[130px] rounded-none border border-[#1F2022] bg-white shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150">
                          {(["Pending", "Approved", "Rejected"] as ReviewStatus[]).map((statusOption) => (
                            <button
                              key={statusOption}
                              type="button"
                              onClick={() => {
                                updateRow(realIndex, "status", statusOption);
                                setOpenStatusIndex(null);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-[11px] font-extrabold transition-colors cursor-pointer flex items-center justify-between ${
                                row.status === statusOption
                                  ? "bg-[#D8D4CD] text-[#1F2022] font-black"
                                  : statusOption === "Approved"
                                  ? "text-emerald-800 hover:bg-emerald-50"
                                  : statusOption === "Rejected"
                                  ? "text-red-800 hover:bg-red-50"
                                  : "text-amber-800 hover:bg-amber-50"
                              }`}
                            >
                              <span>{statusOption}</span>
                              {row.status === statusOption && <Check className="h-3 w-3 stroke-[3]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
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
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-none border-2 transition-all cursor-pointer shadow-2xs ${
                      isChecked
                        ? "border-[#1F2022] bg-[#1F2022] text-white"
                        : "border-[#1F2022]/40 bg-white text-transparent hover:border-[#1F2022]"
                    }`}
                    title="Select item"
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
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
                        
                        {/* Status Change Selector Dropdown */}
                        <div className="relative status-dropdown-container">
                          <button
                            type="button"
                            onClick={() => setOpenStatusIndex(openStatusIndex === realIndex ? null : realIndex)}
                            className={`flex items-center gap-1.5 rounded-none px-3 py-1 text-[11px] font-extrabold transition-transform active:scale-95 cursor-pointer shadow-2xs ${
                              row.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                : row.status === "Rejected"
                                ? "bg-red-100 text-red-800 border border-red-300 hover:bg-red-200"
                                : "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                            }`}
                          >
                            <span>{row.status}</span>
                            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openStatusIndex === realIndex ? "rotate-180" : ""}`} />
                          </button>

                          {openStatusIndex === realIndex && (
                            <div className="absolute right-0 top-full mt-1 z-50 min-w-[130px] rounded-none border border-[#1F2022] bg-white shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150">
                              {(["Pending", "Approved", "Rejected"] as ReviewStatus[]).map((statusOption) => (
                                <button
                                  key={statusOption}
                                  type="button"
                                  onClick={() => {
                                    updateRow(realIndex, "status", statusOption);
                                    setOpenStatusIndex(null);
                                  }}
                                  className={`w-full text-left px-3 py-1.5 text-[11px] font-extrabold transition-colors cursor-pointer flex items-center justify-between ${
                                    row.status === statusOption
                                      ? "bg-[#D8D4CD] text-[#1F2022] font-black"
                                      : statusOption === "Approved"
                                      ? "text-emerald-800 hover:bg-emerald-50"
                                      : statusOption === "Rejected"
                                      ? "text-red-800 hover:bg-red-50"
                                      : "text-amber-800 hover:bg-amber-50"
                                  }`}
                                >
                                  <span>{statusOption}</span>
                                  {row.status === statusOption && <Check className="h-3 w-3 stroke-[3]" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
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
    </>
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