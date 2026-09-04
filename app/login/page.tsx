"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_logged_in", "true");
          document.cookie = "admin_logged_in=true; path=/";
        }
        router.push("/admin");
      } else {
        setError(data.error ?? "Invalid email or password.");
        setLoading(false);
      }
    } catch (err: any) {
      setError("System error occurred while trying to sign in.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* Back to Storefront Link - Floating Top-Left Icon */}
      <Link
        href="/"
        className="absolute left-8 top-8 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E2DC] bg-white text-[#1F2022] shadow-sm hover:border-[#1F2022] hover:bg-[#1F2022] hover:text-white transition-all duration-200"
        title="Back to Storefront"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2 bg-white">
        {/* Left Side: Cap Image Showcase - Smaller Centered Photo on White Background */}
        <div className="relative hidden h-screen w-full overflow-hidden bg-white lg:flex items-center justify-center p-12 lg:p-16">
          <img
            src="/Display-Catalog-1.png"
            alt="Gambar Topi Showcase"
            className="max-h-[75%] w-auto object-contain rounded-none"
          />
        </div>

        {/* Right Side: Login Form Box with Border Outline & Shadow (Welcome!, Email, Password, Masuk Dashboard) */}
        <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-md rounded-none border border-[#DED9CF] bg-white p-8 sm:p-10 shadow-lg space-y-8">
            <div className="text-center pb-2 border-b border-[#EFECE6]">
              <h1 className="text-3xl font-black uppercase tracking-wider text-[#1B1C1E] sm:text-4xl">
                Welcome!
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                {/* Email Field - rounded-none, grey background box with shadow-xs */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-extrabold uppercase text-[#1B1C1E]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan Email"
                    required
                    className="w-full rounded-none border border-[#DED9CF] bg-[#EFECE6] px-4 py-3.5 text-sm font-semibold text-[#1B1C1E] placeholder-[#6E7068] shadow-xs transition focus:border-[#353B2D] focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Password Field - rounded-none, grey background box with shadow-xs */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-xs font-extrabold uppercase text-[#1B1C1E]">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan Password"
                      required
                      className="w-full rounded-none border border-[#DED9CF] bg-[#EFECE6] pl-4 pr-12 py-3.5 text-sm font-semibold text-[#1B1C1E] placeholder-[#6E7068] shadow-xs transition focus:border-[#353B2D] focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 text-[#6E7068] hover:text-[#353B2D] transition-all transform duration-200 active:scale-90 focus:outline-none cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 animate-in fade-in duration-200" />
                      ) : (
                        <Eye className="h-5 w-5 animate-in fade-in duration-200" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Notification Alert */}
              {error && (
                <div className="rounded-none border border-red-200 bg-red-50 p-3.5 text-center text-xs font-bold text-red-600 animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              {/* Action Button: Masuk Dashboard - rounded-none */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-none bg-[#353B2D] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-[#C4A265] hover:text-[#1B1C1E] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin text-white" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Masuk Dashboard"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


