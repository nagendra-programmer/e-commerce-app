USERS
-----
id (PK)
first_name
last_name
username (UNIQUE)
password_hash
created_at


        1
        |
        | (one user has one cart)
        |
        1
CARTS
-----
id (PK)
user_id (FK → users.id UNIQUE)


        1
        |
        | (one cart has many cart items)
        |
        N
CART_ITEMS
----------
id (PK)
cart_id (FK → carts.id)
product_id (FK → products.id)
quantity


USERS
  |
  | (one user has many addresses)
  |
  N
ADDRESSES
---------
id (PK)
user_id (FK → users.id)
full_name
phone
address_line1
address_line2
city
state
postal_code
country


USERS
  |
  | (one user places many orders)
  |
  N
ORDERS
------
id (PK)
user_id (FK → users.id)
address_id (FK → addresses.id)
total_amount
order_status
created_at


        1
        |
        | (one order has many order items)
        |
        N
ORDER_ITEMS
-----------
id (PK)
order_id (FK → orders.id)
product_id (FK → products.id)
quantity
price_at_purchase


CATEGORIES
----------
id (PK)
name (UNIQUE)


        1
        |
        | (one category has many products)
        |
        N
PRODUCTS
--------
id (PK)
title
style
description
brand
price
rating
total_reviews
availability
image_url
is_prime_deal
category_id (FK → categories.id)


PRODUCTS
   |
   | (many-to-many self relation for similar products)
   |
PRODUCT_RELATIONS
-----------------
product_id (FK → products.id)
similar_product_id (FK → products.id)
PRIMARY KEY (product_id, similar_product_id)







https://apis.ccbp.in/products/


add to cart 
delete from 
cart 
shot count of items in cart 
show cart items total at the bottom of the cart 
update quantity in the cart itmes (add updateQuantity method ) 
add remove all feature in the cart 
