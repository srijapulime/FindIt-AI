
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'findit.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    photoName TEXT,
    photoData TEXT,
    createdAt TEXT NOT NULL
  )
`);

console.log('FindIt AI database connected successfully!');

module.exports = db;
