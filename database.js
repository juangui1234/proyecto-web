const Database = require("better-sqlite3");

const db = new Database("usuarios.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        correo TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        carrera TEXT
    )
`);

module.exports = db;
