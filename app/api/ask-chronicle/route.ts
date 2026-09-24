import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PROMPTS: Record<string, (title: string, body: string) => string> = {
  opener: (title, body) =>
    `You are a warm, sharp writing coach. Title: "${title}". Draft: """${body}""". Suggest one stronger opening line or paragraph, and one short sentence on why it works better. Under 80 words, encouraging tone.`,
  stuck: (title, body) =>
    `You are a warm, sharp writing coach. Title: "${title}". Draft so far: """${body}""". The writer is stuck. Give one concrete next sentence or direction to continue with. Under 80 words, encouraging tone.`,
  feedback: (title, body) =>
    `You are a warm, sharp writing coach. Title: "${title}". Draft: """${body}""". Give brief, specific, encouraging feedback: one thing working, one thing to sharpen. Under 90 words.`,
};

export async function POST(req: NextRequest) {
  // Require a signed-in writer — this costs real API tokens per call.
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { kind, title, body } = await req.json();
  const buildPrompt = PROMPTS[kind];
  if (!buildPrompt) {
    return NextResponse.json({ error: "Unknown request kind." }, { status: 400 });
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: buildPrompt(title || "(untitled)", body || "(empty draft)") }],
    });
    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    return NextResponse.json({ text });
  } catch (err) {
    console.error("Ask Chronicle error:", err);
    return NextResponse.json({ error: "Couldn't reach the assistant. Try again." }, { status: 502 });
  }
}
