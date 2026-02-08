const DECOMPOSE_PROMPT = `
You are a research assistant.

Break the following question into 3 to 5 precise web search queries.
Return ONLY a JSON array of strings.
Do not add any extra text.

Question:
{{question}}
`;


const SYNTHESIS_PROMPT = `
You are a research assistant.

Using ONLY the sources below, answer the user's question.
Cite sources using [1], [2], etc.
If the sources are insufficient, say so clearly.

Question:
{{question}}

Sources:
{{sources}}
`;

module.exports = {
  DECOMPOSE_PROMPT,
  SYNTHESIS_PROMPT
};

