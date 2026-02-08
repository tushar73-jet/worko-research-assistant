const express = require('express')
const { decomposeQuestion } = require("./llm")
const router = express.Router()

router.post("/research", async (req, res) => {
  const { question } = req.body

  if (!question) {
    return res.status(400).json({ error: "Question is required" })
  }


  try{
    const queries = await decomposeQuestion(question)
    
    res.json({
        queries
    })
} catch(error){
    console.error(error);
    res.status(500).json({ error: "Failed to process question" })
}
});

module.exports = router

