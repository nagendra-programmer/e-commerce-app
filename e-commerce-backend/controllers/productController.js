const { getDb } = require('../config/db')

const getProducts = async (req, res) => {
  const db = getDb()
  const { title_search = '', category = '', sort_by = '', rating = '' } = req.query

  let query = `SELECT * FROM products WHERE title LIKE ?`
  let params = [`%${title_search}%`]

  if (category) {
    query += ` AND category_id = ?`
    params.push(category)
  }

  if (rating) {
    query += ` AND rating >= ?`
    params.push(rating)
  }

  if (sort_by === 'PRICE_HIGH') {
    query += ` ORDER BY price DESC`
  } else if (sort_by === 'PRICE_LOW') {
    query += ` ORDER BY price ASC`
  } else {
    query += ` ORDER BY price DESC`
  }

  const [products] = await db.execute(query, params)

  res.send({ products })
}

const getPrimeDeals = async (req, res) => {
  const db = getDb()

  const [products] = await db.execute(
    `SELECT * FROM products WHERE is_prime_deal = 1 LIMIT 6`
  )

  res.send({ prime_deals: products })
}

const getProductDetails = async (req, res) => {
  const db = getDb()
  const { id } = req.params

  const [productRows] = await db.execute(
    `SELECT * FROM products WHERE id = ?`,
    [id]
  )

  if (productRows.length === 0) {
    return res.status(404).send({ message: 'Product not found' })
  }

  const product = productRows[0]

  const [similarProducts] = await db.execute(
    `SELECT * FROM products 
     WHERE category_id = ? AND id != ? 
     LIMIT 4`,
    [product.category_id, id]
  )

  res.send({
    ...product,
    similar_products: similarProducts,
  })
}

module.exports = {
  getProducts,
  getPrimeDeals,
  getProductDetails,
}



