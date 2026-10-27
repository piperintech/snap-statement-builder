// SNAP Statement Builder — streams Claude's answer back to statement-builder.html.
// Runs as a Netlify Edge Function so a 20-60 second fill never hits a function timeout:
// the response starts streaming immediately and Netlify only counts CPU time, not waiting time.
// Needs the ANTHROPIC_API_KEY environment variable (same one the summarizer uses).

const MODEL = "claude-sonnet-5-5";
const MAX_PROMPT_CHARS = 150000;

export default async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const apiKey = Netlify.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return json({ error: "ANTHROPIC_API_KEY is not set in Netlify environment variables." }, 500);
  }

  let prompt;
  try {
    ({ prompt } = await req.json());
  } catch {
    return json({ error: "Request body must be JSON with a prompt field." }, 400);
  }
  if (typeof prompt !== "string" || !prompt.trim()) {
    return json({ error: "The prompt is empty." }, 400);
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return json({ error: "That transcript is too long. Split the call and fill each part." }, 413);
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 12000,
      stream: true,
      system:
        "You fill SNAP Insurance claims statement templates from call transcripts. " +
        "Reply with only the JSON object the user describes, no other text.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!upstream.ok) {
    let message = `Claude API error (${upstream.status})`;
    try {
      const data = await upstream.json();
      message = data?.error?.message || message;
    } catch {}
    return json({ error: message }, upstream.status);
  }

  // Pass Anthropic's server-sent events straight through to the page.
  return new Response(upstream.body, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-store",
    },
  });
};

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const config = { path: "/api/statement-fill" };
