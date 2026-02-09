const express = require('express')
const { decomposeQuestion, synthesizeAnswer } = require("./llm")
const { searchWeb } = require("./search");
const router = express.Router()

router.post("/research", async (req, res) => {
  const { question } = req.body

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: "Question must be a non-empty string" })
  }

  if (question.length < 5 || question.length > 500) {
    return res.status(400).json({ error: "Question must be between 5 and 500 characters" })
  }

  try {
    let queries = await decomposeQuestion(question)

    // Fallback if decomposition returns invalid data
    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      queries = [question];
    }

    const searchPromises = queries.map(async (q) => {
      try {
        return await searchWeb(q);
      } catch (searchError) {
        console.error(`Search failed for query "${q}":`, searchError);
        return [];
      }
    });

    const searchResults = await Promise.all(searchPromises);
    const sources = searchResults.flat();

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
  } catch (error) {
    console.error("Research Error:", error);
    res.status(500).json({ error: "An unexpected error occurred while processing your request" })
  }
});

module.exports = router

