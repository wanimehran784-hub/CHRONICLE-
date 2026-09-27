import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InviteClient from "./invite-client";

export default async function InvitePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existingInvites } = await supabase
    .from("invites")
    .select("code, used_by, created_at")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold mb-2">Invite a writer</h1>
      <p className="text-slate-600 mb-8">
        Generate a code and share it. Anyone with the code can create an
        account.
      </p>

      <InviteClient userId={user.id} existingInvites={existingInvites ?? []} />
    </main>
  );
}
