const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getDb } = require('../config/db')




const registerUser = async (req, res) => {
  const db = getDb()
  const { firstName, lastName, username, password } = req.body

  if (!firstName || !lastName || !username || !password) {
    return res.status(400).send({ error_msg: 'Invalid user details' })
  }

  const [rows] = await db.execute(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  )

  if (rows.length > 0) {
    return res.status(400).send({ error_msg: 'User already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.execute(
    `INSERT INTO users (first_name, last_name, username, password_hash)
     VALUES (?, ?, ?, ?)`,
    [firstName, lastName, username, hashedPassword]
  )

  res.status(201).send({ message: 'User registered successfully' })
}




const loginUser = async (req, res) => {
  const db = getDb()
  const { username, password } = req.body

  const [rows] = await db.execute(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  )

  if (rows.length === 0) {
    return res.status(400).send({ error_msg: 'User does not exist' })
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    rows[0].password_hash
  )

  if (!isPasswordCorrect) {
    return res.status(400).send({ error_msg: 'Invalid password' })
  }

  const payload = { userId: rows[0].id }

  const jwtToken = jwt.sign(payload, process.env.JWT_SECRET)

  res.send({ jwt_token: jwtToken })
}

module.exports = { registerUser, loginUser }