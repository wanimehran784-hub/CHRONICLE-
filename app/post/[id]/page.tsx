import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CommentForm from "./comment-form";

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("id, title, body, created_at, published_at, author_id")
    .eq("id", params.id)
    .eq("status", "published")
    .single();

  if (!post) {
    notFound();
  }

  const { data: author } = await supabase
    .from("profiles")
    .select("display_name, handle")
    .eq("id", post.author_id)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: comments } = await supabase
    .from("comments")
    .select("id, body, created_at, author_id")
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  const authorIds = [...new Set((comments ?? []).map((c) => c.author_id))];
  const { data: commentAuthors } = authorIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name, handle")
        .in("id", authorIds)
    : { data: [] };

  const authorMap = new Map(
    (commentAuthors ?? []).map((a) => [a.id, a])
  );

  const date = new Date(post.published_at || post.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.25rem" }}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "#0F172A",
          marginBottom: "0.5rem",
          lineHeight: 1.25,
        }}
      >
        {post.title}
      </h1>

      <p style={{ color: "#64748B", marginBottom: "2rem", fontSize: "0.95rem" }}>
        By {author?.dis
