const express = require("express");
const cors = require('cors')
const routes = require("./routes")

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" })
})

app.use("/", routes)

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
