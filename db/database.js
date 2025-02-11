const sqlite3 = require("sqlite3").verbose();

// Open or create the database
const db = new sqlite3.Database("./db/database.sqlite", (err) => {
  if (err) {
    console.log("Error opening database: ", err.message);
  } else {
    console.log("Database created or opened successfully.");

    // Create the cache table if it doesn't exist
    db.run(
      `
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        value TEXT
      )`,
      (err) => {
        if (err) {
          console.log("Error creating table:", err.message);
        } else {
          console.log("Cache table created or already exists.");
        }
      }
    );
  }
});

// Export the db connection
module.exports = db;
