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

  const authorIds = [...new Set((c
