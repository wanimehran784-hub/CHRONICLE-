import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage({
  params,
}: {
  params: { handle: string };
}) {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, handle, display_name, bio, avatar_url, banner_url, accent_color, created_at")
    .eq("handle", params.handle)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, body, published_at")
    .eq("author_id", profile.id)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const accent = profile.accent_color || "#10B981";
  const joined = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <main style={{ maxWidth: 720, margin: "0 auto" }}>
      {profile.banner_url ? (
        <div
          style={{
            height: 200,
            backgroundImage: `url(${profile.banner_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <div style={{ height: 120, background: accent, opacity: 0.15 }} />
      )}

      <div style={{ padding: "0 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: -40 }}>
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "3px solid #F8FAFC",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "3px solid #F8FAFC",
                background: accent,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: 700,
              }}
            >
              {profile.display_name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0F172A", marginTop: 12 }}>
          {profile.display_name}
        </h1>
        <p style={{ color: "#64748B", fontSize: "0.95rem", marginBottom: 8 }}>
          @{profile.handle} · Joined {joined}
        </p>

        {profile.bio && (
          <p style={{ color: "#1E293B", fontSize: "1rem", lineHeight: 1.6, marginBottom: 24 }}>
            {profile.bio}
          </p>
        )}

        <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 24 }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
            {posts && posts.length > 0 ? `${posts.length} ${posts.length === 1 ? "story" : "stories"}` : "No stories yet"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {(posts || []).map((post) => {
              const excerpt = post.body.length > 160 ? post.body.slice(0, 160) + "…" : post.body;
              return (
                <Link key={post.id} href={`/post/${post.id}`} style={{ textDecoration: "none" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
                    {post.title}
                  </h3>
                  <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.5 }}>{excerpt}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
            }
