require("dotenv").config();
const express = require("express");
const cors = require('cors')
const rateLimit = require("express-rate-limit");
const routes = require("./routes")

const app = express();

// Rate limiting to protect API keys and prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use(limiter);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" })
})

app.use("/", routes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
