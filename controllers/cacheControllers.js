const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

let db;

(async () => {
  db = await open({
    filename: "./db/database.sqlite",
    driver: sqlite3.Database,
  });
})();

const MAX_SIZE = process.env.MAX_CACHE_SIZE || 10;

// Key exists or not
function keyExists(key) {}

// Add Cache
const createCache = async (req, res) => {
  const { key, value } = req.body;

  if (!key || !value) {
    return res.status(400).json({ message: "Key and Value are required" });
  }

  try {
    // Check if the cache is full
    const cacheSize = await db.all("SELECT COUNT(*) as count FROM cache");
    if (cacheSize[0].count >= MAX_SIZE) {
      return res.status(400).json({ message: "Cache is full" });
    }

    // Check if the key already exists
    const existingKeys = await db.all("SELECT key FROM cache WHERE key = ?", [
      key,
    ]);
    if (existingKeys.length > 0) {
      return res.status(400).json({ message: "Key already exists in cache" });
    }

    // Insert the key-value pair
    await db.run(`INSERT INTO cache (key, value) VALUES (?, ?)`, [key, value]);

    return res.status(200).json({ message: "Key added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error inserting data into cache" });
  }
};

// Retrieve Cache
const getCache = async (req, res) => {
  const key = req.params.key;
  try {
    const result = await db.get("SELECT value FROM cache WHERE key = ?", [key]);
    if (result) {
      res.status(200).json(result);
    } else {
      res
        .status(404)
        .json({ message: `Cache entry for key '${key}' not found.` });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving data from cache" });
  }
};

const deleteCache = async (req, res) => {
  const key = req.params.key;
  try {
    const result = await db.run("DELETE FROM cache WHERE key = ?", [key]);
    if (result.changes > 0) {
      res.status(200).json({ message: "Cache entry deleted successfully" });
    } else {
      res
        .status(404)
        .json({ message: `Cache entry for key '${key}' not found.` });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error deleting data from cache" });
  }
};

module.exports = { createCache, getCache, deleteCache };
