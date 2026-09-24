import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

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
        By {author?.display_name || "Unknown writer"}
        {author?.handle ? ` (@${author.handle})` : ""} · {date}
      </p>

      <article
        style={{
          fontSize: "1.1rem",
          lineHeight: 1.8,
          color: "#1E293B",
          whiteSpace: "pre-wrap",
        }}
      >
        {post.body}
      </article>
    </main>
  );
      }
