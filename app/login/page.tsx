"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = Router();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login: DB auth is not ready yet, directly navigate to admin dashboard
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FCFAF7] font-sans">
      {/* Back to storefront link */}
      <Link
        href="/"
        className="absolute left-10 top-10 z-10 inline-flex items-center gap-2 text-xs font-semibold text-[#1F2022] transition hover:opacity-70"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Etalase
      </Link>

      <div className="grid w-full grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Cap Image Showcase */}
        <div className="hidden items-center justify-center p-8 lg:flex">
          <div className="relative h-[600px] w-full max-w-[500px] overflow-hidden rounded-3xl bg-[#E5E2DC]">
            <img
              src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80"
              alt="Gambar Topi"
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
                Welcome!
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-bold text-[#1F2022]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan Email"
                    className="w-full rounded-full border border-[#E5E2DC] bg-[#FFFFFF] px-5 py-3.5 text-sm text-[#1F2022] placeholder-[#94908C] transition focus:border-[#1F2022] focus:outline-none focus:ring-1 focus:ring-[#1F2022]"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-xs font-bold text-[#1F2022]">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan Password"
                    className="w-full rounded-full border border-[#E5E2DC] bg-[#FFFFFF] px-5 py-3.5 text-sm text-[#1F2022] placeholder-[#94908C] transition focus:border-[#1F2022] focus:outline-none focus:ring-1 focus:ring-[#1F2022]"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#1F2022] px-6 py-4 text-sm font-semibold text-[#FCFAF7] shadow-sm transition hover:bg-[#1F2022]/90 hover:shadow-md"
                >
                  Masuk Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return useRouter();
}
