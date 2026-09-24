import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { title, body, status } = await request.json();

  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json(
      { error: "Title and body are required." },
      { status: 400 }
    );
  }

  if (status !== "draft" && status !== "published") {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title: title.trim(),
      body: body.trim(),
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
