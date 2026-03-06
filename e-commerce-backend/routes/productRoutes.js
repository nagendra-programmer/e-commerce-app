const express = require('express')
const authenticateToken = require('../middleware/authMiddleware')
const {
  getProducts,
  getPrimeDeals,
  getProductDetails,
} = require('../controllers/productController')

const router = express.Router()

router.get('/products', authenticateToken, getProducts)
router.get('/prime-deals', authenticateToken, getPrimeDeals)
router.get('/products/:id', authenticateToken, getProductDetails)

module.exports = router

