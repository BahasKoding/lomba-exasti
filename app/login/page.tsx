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
    <div className="flex min-h-screen w-full bg-[#FCFAF7] font-sans">
      {/* Back to Storefront Link - Icon Only */}
      <Link
        href="/"
        className="absolute left-8 top-8 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E2DC] bg-white text-[#1F2022] shadow-2xs hover:border-[#1F2022] hover:bg-[#1F2022] hover:text-white transition-all duration-200"
        title="Back to Storefront"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="grid w-full grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Cap Image Showcase */}
        <div className="hidden items-center justify-center p-8 lg:flex">
          <div className="relative h-[600px] w-full max-w-[500px] overflow-hidden rounded-3xl bg-[#E5E2DC]">
            <img
              src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80"
              alt="Cap Showcase"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-10 left-10 right-10 rounded-2xl bg-white/80 p-6 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1F2022]">SmartCap Studio</p>
              <p className="mt-1 text-sm font-medium text-[#94908C]">
                Crown your individuality with our premium catalog management.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#1F2022] sm:text-5xl">
                Welcome Back!
              </h1>
              <p className="mt-2 text-sm text-[#94908C]">
                Sign in to access your SmartCap Studio admin panel.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-bold text-[#1F2022]">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-full border border-[#E5E2DC] bg-[#FFFFFF] px-5 py-3.5 text-sm text-[#1F2022] placeholder-[#94908C] transition focus:border-[#1F2022] focus:outline-none focus:ring-1 focus:ring-[#1F2022]"
                  />
                </div>

                {/* Password Field with Animated Toggle Icon */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-xs font-bold text-[#1F2022]">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-full border border-[#E5E2DC] bg-[#FFFFFF] pl-5 pr-12 py-3.5 text-sm text-[#1F2022] placeholder-[#94908C] transition focus:border-[#1F2022] focus:outline-none focus:ring-1 focus:ring-[#1F2022]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 text-[#94908C] hover:text-[#1F2022] transition-all transform duration-200 active:scale-90 focus:outline-none cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 animate-in fade-in zoom-in-75 duration-200" />
                      ) : (
                        <Eye className="h-5 w-5 animate-in fade-in zoom-in-75 duration-200" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Notification Alert */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-center text-xs font-bold text-red-600 animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              {/* Action Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1F2022] px-6 py-4 text-sm font-semibold text-[#FCFAF7] shadow-sm transition hover:bg-[#1F2022]/90 hover:shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Sign In to Dashboard"
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


