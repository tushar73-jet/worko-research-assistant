const DECOMPOSE_PROMPT = `
You are a research assistant.

Break the following question into 3 to 5 precise web search queries.
Return ONLY a JSON array of strings.
Do not add any extra text.

Question:
{{question}}
`


const SYNTHESIS_PROMPT = `
You are a helpful research assistant.

Answer the question clearly and directly based on the provided sources.

Adaptive Length Rules:
1. For simple factual questions (e.g., measurements, dates, names), provide a concise ONE-LINE answer.
2. For descriptive or complex questions (e.g., about people, countries, history, or explanations), provide a detailed answer of approximately FIVE lines.
3. Use the sources to SUPPORT the answer.
4. Do NOT explain why information is missing or use phrases like "unfortunately".
5. Keep the answer direct and user-friendly.

Question:
{{question}}

Sources:
{{sources}}
`

module.exports = {
  DECOMPOSE_PROMPT,
  SYNTHESIS_PROMPT
};

