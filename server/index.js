require("dotenv").config();
const express = require("express");
const cors = require("cors");
const autocompleteRoutes = require("./routes/autocomplete.js");
const adsRoutes = require("./routes/ads.js");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});


app.use("/api/autocomplete", autocompleteRoutes);
app.use("/api/ads", adsRoutes);


if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

module.exports = { app };