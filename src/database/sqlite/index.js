const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const path = require("path") // path is used to avoid problems when running app in different operational systems

async function sqliteConnection () {
  const database = await sqlite.open({
    filename: path.resolve(__dirname, "..", "database.db"), // ".." goes up one directory and then create database.db because the first
    // time you run the app, the database directory still doesn't exist
    driver: sqlite3.Database
  });

  return database;
}

module.exports = sqliteConnection;