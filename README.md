# Chronicle

## Setup
1. `npm install`
2. Create a Supabase project, run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local`, fill in your Supabase URL/anon key and an Anthropic API key.
4. `npm run dev`

## What's live
- Full data model + RLS (supabase/schema.sql)
- Auth-ready Supabase clients (browser, server, middleware)
- Homepage pulling real published posts and writer count
- `/api/ask-chronicle` — real Claude-powered writing assistant, auth-gated

## Next up
- Signup/login pages
- Editor page (port from prototype, save to `posts` table)
- Profile, feed, explore, post-detail pages wired to live data
- Invite page as a real form → `waitlist` table or email service
