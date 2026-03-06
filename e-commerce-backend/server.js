
/*
//importing the required modules 
const express=require('express'); 
const mysql=require('mysql2/promise'); 
const bcrypt=require('bcrypt'); 
const jwt=require('jsonwebtoken'); 
const cors=require('cors'); 


const app=express(); 
app.use(express.json()); 
app.use(cors()); 

let db;
const initDb=async ()=>{
  try{
    db=await mysql.createPool({
      host:'localhost',
      user:'root',
      password:'nagendra@developer',
      database:'e_commerce_db',
      connectionLimit:10 
    })

    app.listen(5000,()=>{
      console.log('Server running at http://localhost:5000'); 
    })

  }
  catch(err){
    console.log(`DB Error:${err}`);
    process.exit(1) 
  }
  
}

initDb(); 

//register user api 
app.post('/register', async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  if(firstName.trim()===''|| lastName.trim()==='' || username.trim()===''){
    return res.status(400).send({error_msg:'Invalid user details'}); 
  }

  if (password.length < 8) {
    return res
      .status(400)
      .send({ error_msg: 'Password must have minimum 8 characters' });
  }

  const [rows] = await db.execute(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  );
   

  if (rows.length > 0) {
    return res
      .status(400)
      .send({ error_msg: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.execute(
    `
    INSERT INTO users (first_name, last_name, username, password_hash)
    VALUES (?, ?, ?, ?)
    `,
    [firstName, lastName, username, hashedPassword]
  );

  return res
    .status(201)
    .send({ message: 'User registered successfully' });
});



//login user api 
// take data , check if user exists, if user exists check password then generate jwt_token and send else send error_msg 
app.post('/login',async(req,res)=>{
  const {username,password}=req.body; 
  if(username.trim()==='' || password.trim()===''){
    return res.status(400).send({error_msg:"Invalid user details"}) ; 
  }

  if(password.length<8){
    return res.status(400).send({error_msg:"Password should have atleast 8 characters"}); 
  }

  const [rows]=await db.execute(`select * from users where  username=?`,[username]); 
  

  if(rows.length>0){
    const isPasswordCorrect=await bcrypt.compare(password,rows[0].password_hash); 
    if(isPasswordCorrect){
      const payload = { userId: rows[0].id }; 
      const jwtToken=jwt.sign(payload,'MY_SECRET_TOKEN'); 
      return res.send({jwt_token:jwtToken}); 
    }
    else{
      return res.status(400).send({error_msg:'Invalid password'}); 
    } 
  }
  else{
    return res.status(400).send({error_msg:'User does not exist'}); 
  }
  
})  


//authenticate middleware 
const authenticateToken=(req,res,next)=>{
 const authHeader = req.headers.authorization;
  if(authHeader===undefined){
    return res.status(401).send({error_msg:"Invalid jwt token"}); 
  }  
  const jwtToken=authHeader.split(' ')[1]; 
  jwt.verify(jwtToken, 'MY_SECRET_TOKEN',(error,payload)=>{
    if(error){
      return res.status(401).send({error_msg:'Invalid jwt token '}); 
    }
    else{
      req.userId = payload.userId; 
      next(); 
    }
  })
}


//get products 
app.get('/products', authenticateToken, async (req, res) => {
  const { title_search = '', category = '', sort_by = '', rating = '' } = req.query;

  let query = `SELECT * FROM products WHERE title LIKE ?`;
  let params = [`%${title_search}%`];

  if (category) {
    query += ` AND category_id = ?`;
    params.push(category);
  }

  if (rating) {
    query += ` AND rating >= ?`;
    params.push(rating);
  }

  if (sort_by === "PRICE_HIGH") {
    query += ` ORDER BY price DESC`;
  } else if (sort_by === "PRICE_LOW") {
    query += ` ORDER BY price ASC`;
  } else {
    query += ` ORDER BY price DESC`;
  }

  const [products] = await db.execute(query, params);
  //console.log(products); 
  res.send({ products });

});

//prime deals 
app.get('/prime-deals',authenticateToken,async(req,res)=>{
  const query=`select * from products where is_prime_deal=1 limit 6`; 
  const [products]=await db.execute(query); 
  console.log(products); 
  res.send({ prime_deals: products });
})



//specifi product details 
app.get('/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get product details
    const productQuery = `
      SELECT * FROM products
      WHERE id = ?
    `;
    const [productRows] = await db.execute(productQuery, [id]);

    // If product not found
    if (productRows.length === 0) {
      return res.status(404).send({ message: "Product not found" });
    }

    const product = productRows[0];

    //Get similar products (same category_id)
    const similarProductsQuery = `
      SELECT * FROM products
      WHERE category_id = ?
      AND id != ?
      LIMIT 4
    `;
    const [similarProducts] = await db.execute(
      similarProductsQuery,
      [product.category_id, id]
    );

    // 3️⃣ Send response
    res.send({
      ...product,
      similar_products: similarProducts
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

*/

require("dotenv").config()

const express = require('express')
const cors = require('cors')
const { initDb } = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')

const app = express()

// both express.json() and cors() return middleware functions 
app.use(express.json())
app.use(cors()) // For every request, allow cross-origin requests.


//For all requests that start with this path, send them to this middleware or router.”
app.use('/auth', authRoutes) 
app.use('/', productRoutes)
app.use('/api/cart', cartRoutes)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await initDb()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()