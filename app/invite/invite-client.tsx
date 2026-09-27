"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Invite = {
  code: string;
  used_by: string | null;
  created_at: string;
};

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function InviteClient({
  userId,
  existingInvites,
}: {
  userId: string;
  existingInvites: Invite[];
}) {
  const [invites, setInvites] = useState<Invite[]>(existingInvites);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const supabase = createClient();

  async function handleGenerate() {
    setLoading(true);
    const code = generateCode();

    const { data, error } = await supabase
      .from("invites")
      .insert({ code, created_by: userId })
      .select("code, used_by, created_at")
      .single();

    setLoading(false);

    if (!error && data) {
      setInvites([data, ...invites]);
    }
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-navy text-white px-5 py-2.5 rounded-md font-medium disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate invite code"}
      </button>

      <div className="mt-8 space-y-3">
        {invites.length === 0 && (
          <p className="text-slate-500 text-sm">
            No codes generated yet.
          </p>
        )}

        {invites.map((invite) => (
          <div
            key={invite.code}
            className="flex items-center justify-between border border-slate-200 rounded-md px-4 py-3"
          >
            <div>
              <span className="font-mono text-lg tracking-wider">
                {invite.code}
              </span>
              {invite.used_by && (
                <span className="ml-3 text-xs text-emerald-dark font-medium">
                  Used
                </span>
              )}
            </div>

            {!invite.used_by && (
              <button
                onClick={() => handleCopy(invite.code)}
                className="text-sm underline"
              >
                {copiedCode === invite.code ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
