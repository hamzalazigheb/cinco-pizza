"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push(redirect);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Identifiants incorrects");
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#24221F] flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Cinco Pizza"
            width={56}
            height={56}
            className="object-contain mb-4"
            style={{ width: "auto", height: "56px" }}
          />
          <h1 className="font-display text-2xl text-[#F5EBDD]">Espace Admin</h1>
          <p className="font-ui text-[0.72rem] text-white/35 mt-1 uppercase tracking-widest">
            Cinco Pizza
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#2E2B27] rounded-2xl p-6 space-y-4 shadow-2xl border border-white/5"
        >
          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-[#24221F] text-[#F5EBDD] placeholder-white/25
                font-ui text-sm rounded-xl pl-10 pr-4 py-3
                border border-white/8 focus:border-[#C92326]/60
                outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Mot de passe"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#24221F] text-[#F5EBDD] placeholder-white/25
                font-ui text-sm rounded-xl pl-10 pr-10 py-3
                border border-white/8 focus:border-[#C92326]/60
                outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30
                hover:text-white/60 transition cursor-pointer"
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="font-ui text-[0.75rem] text-[#C92326] text-center bg-[#C92326]/10
              rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C92326] hover:bg-[#A91D20] text-white font-ui font-600
              text-sm rounded-xl py-3 transition flex items-center justify-center gap-2
              disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Connexion...</>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <p className="font-ui text-[0.65rem] text-white/15 text-center mt-6">
          Accès réservé à l&apos;équipe Cinco Pizza
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
