const GROQ_API_URL =
  process.env.GROQ_API_URL ||
  "https://api.groq.com/openai/v1/chat/completions";

function requireGroqConfig() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY in backend/.env");
  }

  if (!process.env.GROQ_MODEL) {
    throw new Error("Missing GROQ_MODEL in backend/.env");
  }
}

function safeParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function groqJson({
  system,
  user,
  temperature = 0.2,
}) {
  requireGroqConfig();

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL,
      temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content || "{}";

  return safeParseJson(raw);
}