"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                display_name: displayName.trim(),
                handle: handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""),
              },
            },
          })
        : await supabase.auth.signInWithPassword({ email, password });

    setBusy(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  const input = "w-full border border-navy/30 rounded px-3 py-2 font-sans bg-white";

  return (
    <main className="max-w-[420px] mx-auto px-6 py-16">
      <h1 className="font-display font-semibold text-4xl text-center mb-2">Chronicle</h1>
      <p className="text-center font-sans text-inkSoft mb-8">
        {mode === "login" ? "Welcome back." : "Start your Chronicle."}
      </p>

      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" && (
          <>
            <input className={input} placeholder="Your name" value={displayName}
              onChange={(e) => setDisplayName(e.target.value)} required />
            <input className={input} placeholder="Handle (e.g. jane)" value={handle}
              onChange={(e) => setHandle(e.target.value)} required />
          </>
        )}
        <input className={input} type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input className={input} type="password" placeholder="Password (6+ characters)" value={password}
          onChange={(e) => setPassword(e.target.value)} minLength={6} required />

        {error && <p className="text-red-600 font-sans text-sm">{error}</p>}

        <button type="submit" disabled={busy}
          className="w-full bg-navy text-white font-sans font-semibold rounded py-2 disabled:opacity-60">
          {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      <button type="button" className="block mx-auto mt-6 font-sans text-sm text-inkSoft underline"
        onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
        {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
      </button>
    </main>
  );
      }
