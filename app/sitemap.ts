import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, published_at")
    .eq("status", "published");

  const postUrls = (posts ?? []).map((post) => ({
    url: `https://chronicle-rosy.vercel.app/post/${post.id}`,
    lastModified: post.published_at ?? new Date(),
  }));

  return [
    {
      url: "https://chronicle-rosy.vercel.app",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://chronicle-rosy.vercel.app/feed",
      lastModified: new Date(),
      priority: 0.8,
    },
    ...postUrls,
  ];
}
