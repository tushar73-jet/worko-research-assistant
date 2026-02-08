const Groq = require("groq-sdk");
const { DECOMPOSE_PROMPT } = require("./prompts")

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

  const text = completion.choices[0].message.content
  return JSON.parse(text)
}

module.exports = {
  decomposeQuestion
};
