const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// Express App
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In memeory cache object
const cache = new Map();
const MAX_SIZE = process.env.MAX_CACHE_SIZE || 10;

// Post Request /cache -> Stores a key-value pair
app.post("/cache", (req, res) => {
  const { key, value } = req.body;

  if (!key || !value) {
    return res.status(400).json({ message: "Key and Value are required" });
  }

  if (cache.size >= MAX_SIZE) {
    return res.status(400).json({ message: "Cache is full" });
  }

  cache.set(key, value);
  res.status(201).json({ message: "Key added to cache successfully" });
});

// GET Request /cache/:key -> Retrieves the value for a key
app.get("/cache/:key", (req, res) => {
  const key = req.params.key;

  if (!key) {
    return res.status(400).json({ message: "Key is required" });
  }

  if (cache.has(key)) {
    return res
      .status(200)
      .json({ message: "Key found", value: cache.get(key) });
  } else {
    return res.status(404).json({ message: "Key not found" });
  }
});

// DELETE Request /cache/:key -> Deletes a key-value pair
app.delete("/cache/:key", (req, res) => {
  const key = req.params.key;

  if (!key) {
    return res.status(400).json({ message: "Key is required" });
  }

  if (cache.has(key)) {
    cache.delete(key);
    return res.status(200).json({ message: "Key deleted successfully" });
  } else {
    return res.status(404).json({ message: "Key not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
