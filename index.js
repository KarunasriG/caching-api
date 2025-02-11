const express = require("express");
const cors = require("cors");
require("dotenv").config();
const router = require("./routes/cacheRoutes");

const { addToCache } = require("./controllers/cacheControllers");

// Express App
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/cache", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
