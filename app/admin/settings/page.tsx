"use client";

import { useEffect, useState } from "react";
import { Pencil, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    whatsappNumber: "81234567890",
    inquiryTemplate: "Hello SmartCap Studio, I would like to inquire about..",
    storeName: "SmartCap Studio",
    tagline: "Crown Your Individuality",
    address: "Jl. Haji Nawir Husadah II, Jakarta, Indonesia",
    instagramUrl: "SmartCap Studio",
    tiktokUrl: "",
    facebookUrl: "",
    xUrl: "",
  });

  const [savedOrderMsg, setSavedOrderMsg] = useState("");
  const [savedBrandingMsg, setSavedBrandingMsg] = useState("");
  const [savedSocialMsg, setSavedSocialMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("smartcap_store_settings");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch (e) {}
      }
    }
  }, []);

  const saveSettings = (msgSetter: (s: string) => void) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("smartcap_store_settings", JSON.stringify(settings));
    }
    msgSetter("Saved successfully!");
    setTimeout(() => msgSetter(""), 3000);
  };

  return (
    <div className="space-y-10 pb-16 font-sans">
      {/* Title & Subtitle matching wireframe */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#1F2022] sm:text-4xl">
          Setting & Configuration
        </h1>
        <p className="mt-1.5 text-sm font-medium text-[#6E7068]">
          Manage your store identity, automated messaging, and platform settings.
        </p>
      </div>

      {/* Section 1: Order Configuration */}
      <div className="space-y-3">
        <h2 className="text-xl font-black text-[#1F2022]">Order Configuration</h2>
        <div className="rounded-none border border-[#DED9CF] bg-[#EFECE6] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Active WhatsApp Order Number */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F2022]">
                Active WhatsApp Order Number:
              </label>
              <div className="flex items-center">
                <span className="bg-[#E5E2DC] border border-r-0 border-[#DED9CF] px-3.5 py-3 text-sm font-extrabold text-[#1F2022]">
                  +62
                </span>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="81234567890"
                  className="w-full border border-[#DED9CF] bg-white px-4 py-3 text-sm font-semibold text-[#1F2022] outline-none focus:border-[#353B2D]"
                />
              </div>
            </div>

            {/* Default Inquiry Template Message */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F2022]">
                Default Inquiry Template Message:
              </label>
              <textarea
                rows={4}
                value={settings.inquiryTemplate}
                onChange={(e) => setSettings({ ...settings, inquiryTemplate: e.target.value })}
                className="w-full border border-[#DED9CF] bg-white p-4 text-sm font-semibold text-[#1F2022] outline-none focus:border-[#353B2D]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => saveSettings(setSavedOrderMsg)}
              className="rounded-none bg-[#2E4F32] px-6 py-3 text-xs font-extrabold text-white shadow-xs transition hover:bg-[#353B2D] cursor-pointer"
            >
              Save Order Setting
            </button>
            {savedOrderMsg && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                <Check className="h-4 w-4" /> {savedOrderMsg}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Store Branding & Identity */}
      <div className="space-y-3">
        <h2 className="text-xl font-black text-[#1F2022]">Store Branding & Identity</h2>
        <div className="rounded-none border border-[#DED9CF] bg-[#EFECE6] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Store Name & Tagline */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1F2022]">Store Name</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full border border-[#DED9CF] bg-white pr-10 pl-4 py-3 text-sm font-semibold text-[#1F2022] outline-none focus:border-[#353B2D]"
                  />
                  <Pencil className="absolute right-3 h-4 w-4 text-[#6E7068]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1F2022]">Tagline:</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full border border-[#DED9CF] bg-white pr-10 pl-4 py-3 text-sm font-semibold text-[#1F2022] outline-none focus:border-[#353B2D]"
                  />
                  <Pencil className="absolute right-3 h-4 w-4 text-[#6E7068]" />
                </div>
              </div>
            </div>

            {/* Physical Address Location */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F2022]">Physical Address Location:</label>
              <textarea
                rows={4}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full border border-[#DED9CF] bg-white p-4 text-sm font-semibold text-[#1F2022] outline-none focus:border-[#353B2D]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => saveSettings(setSavedBrandingMsg)}
              className="rounded-none bg-[#2E4F32] px-6 py-3 text-xs font-extrabold text-white shadow-xs transition hover:bg-[#353B2D] cursor-pointer"
            >
              Save
            </button>
            {savedBrandingMsg && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                <Check className="h-4 w-4" /> {savedBrandingMsg}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Social Media & External Links */}
      <div className="space-y-3">
        <h2 className="text-xl font-black text-[#1F2022]">Social Media & External Links</h2>
        <div className="rounded-none border border-[#DED9CF] bg-[#EFECE6] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Instagram */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F2022]">Instagram URL:</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  placeholder="SmartCap Studio"
                  className="w-full border border-[#DED9CF] bg-white pr-10 pl-4 py-3 text-sm font-semibold text-[#1F2022] outline-none focus:border-[#353B2D]"
                />
                <Pencil className="absolute right-3 h-4 w-4 text-[#6E7068]" />
              </div>
            </div>

            {/* Tiktok */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F2022]">Tiktok URL:</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={settings.tiktokUrl}
                  onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                  placeholder="------"
                  className="w-full border border-[#DED9CF] bg-white pr-10 pl-4 py-3 text-sm font-semibold text-[#1F2022] outline-none focus:border-[#353B2D]"
                />
                <Pencil className="absolute right-3 h-4 w-4 text-[#6E7068]" />
              </div>
            </div>

            {/* Facebook */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F2022]">Facebook URL:</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  placeholder="------"
                  className="w-full border border-[#DED9CF] bg-white pr-10 pl-4 py-3 text-sm font-semibold text-[#1F2022] outline-none focus:border-[#353B2D]"
                />
                <Pencil className="absolute right-3 h-4 w-4 text-[#6E7068]" />
              </div>
            </div>

            {/* X (Twitter) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F2022]">X Url:</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={settings.xUrl}
                  onChange={(e) => setSettings({ ...settings, xUrl: e.target.value })}
                  placeholder="------"
                  className="w-full border border-[#DED9CF] bg-white pr-10 pl-4 py-3 text-sm font-semibold text-[#1F2022] outline-none focus:border-[#353B2D]"
                />
                <Pencil className="absolute right-3 h-4 w-4 text-[#6E7068]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => saveSettings(setSavedSocialMsg)}
              className="rounded-none bg-[#2E4F32] px-6 py-3 text-xs font-extrabold text-white shadow-xs transition hover:bg-[#353B2D] cursor-pointer"
            >
              Save Links
            </button>
            {savedSocialMsg && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                <Check className="h-4 w-4" /> {savedSocialMsg}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
