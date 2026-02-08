const express = require('express')
const router = express.Router()

router.post("/research", async (req, res) => {
  const { question } = req.body

  if (!question) {
    return res.status(400).json({ error: "Question is required" })
  }

  return res.json({
    answer: "mock answer.",
    sources: []
  })
});

module.exports = router

