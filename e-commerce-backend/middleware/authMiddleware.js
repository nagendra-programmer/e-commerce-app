const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).send({ error_msg: 'Invalid JWT Token' })
  }

  const jwtToken = authHeader.split(' ')[1]

  jwt.verify(jwtToken, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(401).send({ error_msg: 'Invalid JWT Token' })
    }

    req.userId = payload.userId
    next()
  })
}

module.exports = authenticateToken

