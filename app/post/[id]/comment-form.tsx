"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CommentForm({
  postId,
  isLoggedIn,
}: {
  postId: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setBusy(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setBusy(false);
      setError("You need to log in to comment.");
      return;
    }

    const { error: insertError } = await supabase.from("comments").insert({
      post_id: postId,
      author_id: user.id,
      body: body.trim(),
    });

    setBusy(false);

    if (insertError) {
      setError("Couldn't post your comment. Try again.");
      return;
    }

    setBody("");
    router.refresh();
  }

  if (!isLoggedIn) {
    return (
      <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
        <a href="/login" style={{ textDecoration: "underline" }}>
          Log in
        </a>{" "}
        to leave a comment.
      </p>
    );
  }

  return (
    <form onSubmit={submit}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
        style={{
          width: "100%",
          border: "1px solid #CBD5E1",
          borderRadius: 6,
          padding: "0.6rem",
          fontFamily: "inherit",
          fontSize: "0.95rem",
          resize: "vertical",
        }}
      />
      {error && (
        <p style={{ color: "#DC2626", fontSize: "0.85rem", marginTop: "0.4rem" }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || !body.trim()}
        style={{
          marginTop: "0.6rem",
          background: "#0F172A",
          color: "white",
          fontWeight: 600,
          padding: "0.5rem 1.2rem",
          borderRadius: 6,
          opacity: busy || !body.trim() ? 0.6 : 1,
        }}
      >
        {busy ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}
