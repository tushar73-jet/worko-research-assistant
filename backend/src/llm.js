const Groq = require("groq-sdk");
const { DECOMPOSE_PROMPT } = require("./prompts")

const { SYNTHESIS_PROMPT } = require("./prompts");


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function decomposeQuestion(question) {
  const prompt = DECOMPOSE_PROMPT.replace("{{question}}", question)

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  });

  try {
    const text = completion.choices[0].message.content
    return JSON.parse(text)
  } catch (error) {
    console.error("Failed to parse decomposition response, falling back to original question:", error);
    return [question];
  }
}

async function synthesizeAnswer(question, sources) {
  if (!sources || sources.length === 0) {
    return "I couldn't find any relevant sources to answer that question correctly. Please try rephrasing or asking something else.";
  }

  const formattedSources = sources
    .slice(0, 5)
    .map(
      (s, i) =>
        `[${i + 1}] ${s.title}\n${s.snippet}\n${s.url}`
    )
    .join("\n\n");

  const prompt = SYNTHESIS_PROMPT
    .replace("{{question}}", question)
    .replace("{{sources}}", formattedSources);

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  return completion.choices[0].message.content;
}

module.exports = {
  decomposeQuestion,
  synthesizeAnswer
};
