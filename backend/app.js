const express = require("express");
const path = require("path");
const kampusRoutes = require("./routes/campusRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API (tetap sama)
app.use('/api', kampusRoutes);

// ==== SERVE FRONTEND BUILD ==== //
const frontendPath = path.join(__dirname, "public", "dist");

// Serve file statis
app.use(express.static(frontendPath));

// Fallback untuk React Router
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


module.exports = app;
