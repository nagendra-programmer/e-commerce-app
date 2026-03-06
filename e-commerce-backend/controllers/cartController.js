const { getDb } = require('../config/db')



//1️⃣ Add To Cart
exports.addToCart = async (req, res) => {
  try {
    const db = getDb()
    const userId = req.userId   // from authMiddleware
    const { product_id, quantity } = req.body

    if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid product or quantity" })
    }

    const [product] = await db.query(
    "SELECT id FROM products WHERE id = ?",
     [product_id]
    )

    if (product.length === 0) {
    return res.status(404).json({ message: "Product not found" })
    }

    // 1. Check if cart exists
    const [cartRows] = await db.query(
      'SELECT id FROM carts WHERE user_id = ?',
      [userId]
    )

    let cartId

    if (cartRows.length > 0) {
      cartId = cartRows[0].id
    } else {
      // 2. Create new cart
      const [newCart] = await db.query(
        'INSERT INTO carts (user_id) VALUES (?)',
        [userId]
      )
      cartId = newCart.insertId
    }

    // 3. Check if product already exists in cart
    const [itemRows] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, product_id]
    )

    if (itemRows.length > 0) {
      return res.send({message:"Item already exists in the cart"})
    } 
    else {
      // Insert new item
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, product_id, quantity]
      )
    }

    res.status(200).json({ message: 'Item added to cart' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}


//2️⃣ Get Cart
exports.getCart = async (req, res) => {
  try {
    const db = getDb()
    const userId = req.userId

    const [rows] = await db.query(
      `SELECT 
          ci.id AS item_id,
          p.title,
          p.image_url,
          p.price,
          ci.quantity,
          (p.price * ci.quantity) AS total_price
       FROM carts c
       JOIN cart_items ci ON c.id = ci.cart_id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    )

    const grandTotal = rows.reduce(
      (sum, item) => sum + Number(item.total_price),
       0
    )

    res.status(200).json({
      success: true,
      totalItems: rows.length,
      grandTotal,
      items: rows,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}



//3️⃣ Update Quantity
exports.updateCartItem = async (req, res) => {
  try {
    const db = getDb()
    const { itemId } = req.params
    const { quantity } = req.body

   
   if (quantity <= 0) {
        await db.query('DELETE FROM cart_items WHERE id = ?', [itemId])
        return res.status(200).json({ message: "Item removed" })
    }
    await db.query(
    `UPDATE cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    SET ci.quantity = ?
    WHERE ci.id = ? AND c.user_id = ?`,
    [quantity, itemId, req.userId]
    )

    res.status(200).json({ message: 'Cart updated' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}



//4️⃣ Remove Item
exports.removeCartItem = async (req, res) => {
  try {
    const db = getDb()
    const { itemId } = req.params

    await db.query(
    `DELETE ci FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    WHERE ci.id = ? AND c.user_id = ?`,
    [itemId, req.userId]
    )

    res.status(200).json({ message: 'Item removed' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}


// 5️⃣ Clear Entire Cart
exports.clearCart = async (req, res) => {
  try {
    const db = getDb()
    const userId = req.userId

    const [result] = await db.query(
      `DELETE ci FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE c.user_id = ?`,
      [userId]
    )

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      deletedItems: result.affectedRows
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}