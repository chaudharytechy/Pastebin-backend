const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const pasteRoutes = require("./routes/paste.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", pasteRoutes);

module.exports = app;
