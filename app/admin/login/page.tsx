"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-void px-6 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(124,108,246,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(69,217,200,0.12),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card relative z-10 w-full max-w-sm rounded-2xl p-8"
      >
        <div className="flex items-center gap-2 mb-1">
          <Lock size={16} className="text-violet-soft" />
          <p className="font-mono-label text-[11px] uppercase text-text-faint">
            Restricted area
          </p>
        </div>
        <h1 className="font-display text-2xl font-semibold mt-2">
          Admin sign in
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Enter the admin password to edit site content.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-mono-label uppercase text-text-faint mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg glass px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-violet-soft/60 transition-colors"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-amber bg-amber/10 border border-amber/20 rounded-lg px-3 py-2.5">
              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-violet text-void font-medium text-sm py-2.5 hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Signing in\u2026" : "Sign in"}
          </button>
        </form>

        <a
          href="/"
          className="block text-center mt-5 text-xs text-text-faint hover:text-text-muted transition"
        >
          &larr; Back to site
        </a>
      </motion.div>
    </div>
  );
}
