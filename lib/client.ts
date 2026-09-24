import { createBrowserClient } from "@supabase/ssr";

// Used in Client Components. Reads the public, anon-key config —
// safe to expose, RLS is what actually protects the data.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
