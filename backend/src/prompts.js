const DECOMPOSE_PROMPT = `
You are a research assistant.

Break the following question into 3 to 5 precise web search queries.
Return ONLY a JSON array of strings.
Do not add any extra text.

Question:
{{question}}
`;

module.exports = {
  DECOMPOSE_PROMPT
};

