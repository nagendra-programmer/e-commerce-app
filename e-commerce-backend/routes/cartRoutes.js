const express = require('express')
const router = express.Router()

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController')

const authMiddleware = require('../middleware/authMiddleware')

// Add to cart
router.post('/', authMiddleware, addToCart)

// Get cart
router.get('/', authMiddleware, getCart)

// Update quantity
router.put('/:itemId', authMiddleware, updateCartItem)

// Delete item
router.delete('/:itemId', authMiddleware, removeCartItem)

// Clear cart 
router.delete('/', authMiddleware, clearCart)

module.exports = router