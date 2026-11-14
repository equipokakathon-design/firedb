const SYSTEM = `You are FireDB's assistant for the NASA Space Apps 2026 challenge "Flame in Freefall".
Answer ONLY with facts contained in the FIREDB CONTEXT you receive; never invent numbers or investigations.
Cite the PSI ID (for example PSI-69) of every investigation you mention.
If the context does not cover the question, say so clearly and point to the closest available data.
Mention relevant caveats: in inverse flames the O2 value is the burner's; BASS-II and Saffire record no pressure;
PSI has no partial-gravity combustion data; FLEX helium groups had lower oxygen.
Be concise: 3 to 7 sentences or a short bullet list. Plain text; you may use **bold** and "- " bullets.`;

async function callGemini(model, key, lang, context, question) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: `${SYSTEM}\nAnswer in ${lang}.` }] },
      contents: [{ role: "user", parts: [{ text: `${context}\n\nQUESTION: ${question}` }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
    }),
  });
}

export default async (req) => {
  if (req.method !== "POST") return Response.json({ error: "use POST" }, { status: 405 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return Response.json({ error: "GEMINI_API_KEY is not set in Netlify" }, { status: 503 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: "invalid JSON" }, { status: 400 }); }
  const question = String(body.question || "").slice(0, 600).trim();
  const context = String(body.context || "").slice(0, 40000);
  const lang = body.lang === "es" ? "Spanish" : "English";
  if (!question) return Response.json({ error: "empty question" }, { status: 400 });
  let model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  let r = await callGemini(model, key, lang, context, question);
  if (r.status === 404 && !process.env.GEMINI_MODEL) {
    model = "gemini-flash-latest";
    r = await callGemini(model, key, lang, context, question);
  }
  if (!r.ok) {
    const detail = (await r.text()).slice(0, 400);
    return Response.json({ error: "gemini_error", status: r.status, detail }, { status: 502 });
  }
  const j = await r.json();
  const text = (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
  if (!text) return Response.json({ error: "empty answer" }, { status: 502 });
  return Response.json({ text, model });
};

export const config = { path: "/api/ask" };
