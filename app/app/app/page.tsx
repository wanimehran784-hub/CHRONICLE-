import { createClient } from "@/lib/supabase/server";

export const revalidate = 30; // keep the masthead feeling live without hitting the DB on every request

export default async function HomePage() {
  const supabase = createClient();

  const { data: leadPost } = await supabase
    .from("posts")
    .select("id, title, body, published_at, profiles(display_name, handle)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { count: writerCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  return (
    <main className="max-w-[1080px] mx-auto px-6">
      <header className="border-b-[3px] border-navy pt-7 pb-4">
        <div className="flex justify-between text-xs font-sans text-inkSoft mb-3">
          <span>
            <span className="text-emerald-dark font-semibold">● Live edition</span> ·{" "}
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
          <span>{writerCount ?? 0} writers publishing this week</span>
        </div>
        <h1 className="font-display font-semibold text-center text-6xl">Chronicle</h1>
        <p className="text-center font-sans text-inkSoft mt-1">Every writer has a Chronicle.</p>
      </header>

      <section className="py-9">
        {leadPost ? (
          <>
            <div className="font-sans text-xs font-semibold text-emerald-dark mb-2">
              Today's lead story
            </div>
            <h2 className="font-display font-semibold text-3xl mb-3 max-w-[20ch]">
              {leadPost.title}
            </h2>
            <p className="font-sans text-sm text-inkSoft mb-5">
              By {(leadPost.profiles as any)?.display_name ?? "A Chronicle writer"}
            </p>
            <p className="max-w-[62ch] border-l-[3px] border-emerald pl-4">
              {leadPost.body.slice(0, 280)}…
            </p>
          </>
        ) : (
          <p className="font-sans text-inkSoft">
            No published stories yet — the first one goes right here.
          </p>
        )}
      </section>
    </main>
  );
}
