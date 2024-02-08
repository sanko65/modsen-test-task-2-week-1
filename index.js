const express = require("express");
require("dotenv").config();
const meetupRouter = require("./routes/meetupRoutes");

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

app.use(express.json());
app.use("/api", meetupRouter);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
