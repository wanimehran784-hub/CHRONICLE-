"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function WritePage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(status: "draft" | "published") {
    setError("");

    if (!title.trim() || !body.trim()) {
      setError("Please add a title and some content before saving.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, status }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    const post = await res.json();
    router.push(status === "published" ? `/post/${post.id}` : "/");
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.25rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem", color: "#0F172A" }}>
        Write a new story
      </h1>

      {error && (
        <p style={{ color: "#DC2626", marginBottom: "1rem", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          fontSize: "1.5rem",
          fontWeight: 600,
          border: "none",
          borderBottom: "1px solid #E2E8F0",
          padding: "0.5rem 0",
          marginBottom: "1.25rem",
          outline: "none",
          color: "#0F172A",
        }}
      />

      <textarea
        placeholder="Tell your story..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={16}
        style={{
          width: "100%",
          fontSize: "1.05rem",
          lineHeight: 1.7,
          border: "none",
          outline: "none",
          resize: "vertical",
          color: "#1E293B",
          fontFamily: "inherit",
        }}
      />

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
        <button
          onClick={() => handleSubmit("draft")}
          disabled={loading}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "6px",
            border: "1px solid #0F172A",
            background: "transparent",
            color: "#0F172A",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Draft
        </button>

        <button
          onClick={() => handleSubmit("published")}
          disabled={loading}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "6px",
            border: "none",
            background: "#10B981",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </main>
  );
              }
