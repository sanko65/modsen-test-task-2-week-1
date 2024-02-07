const express = require("express");
require("dotenv").config();

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});

app.get("/", (req, res) => {
  res.json({ info: `modsen meetup api` });
});
