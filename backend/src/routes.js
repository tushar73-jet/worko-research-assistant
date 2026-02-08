const express = require('express')
const { decomposeQuestion,synthesizeAnswer } = require("./llm")
const { searchWeb } = require("./search");
const router = express.Router()

router.post("/research", async (req, res) => {
  const { question } = req.body

  if (!question) {
    return res.status(400).json({ error: "Question is required" })
  }


  try{
    const queries = await decomposeQuestion(question)

    const sources = [];
    for (const q of queries) {
      const results = await searchWeb(q);
      sources.push(...results);
    }

    const uniqueSources = [];
    const seen = new Set();

    for (const src of sources) {
      if (src.url && !seen.has(src.url)) {
        seen.add(src.url);
        uniqueSources.push(src);
      }
    }

    const answer = await synthesizeAnswer(
      question,
      uniqueSources
    );
    
    res.json({
        answer,
        citations: uniqueSources
    })
} catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to process question" })
}
});

module.exports = router

