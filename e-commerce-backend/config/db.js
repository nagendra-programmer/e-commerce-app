const mysql = require("mysql2/promise")

let db

const initDb = async () => {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10,
    })

    console.log("Database Connected")
  } catch (err) {
    console.log(`DB Error: ${err}`)
    process.exit(1)
  }
}

const getDb = () => db

module.exports = { initDb, getDb }