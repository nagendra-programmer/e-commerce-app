import { BsPlus, BsDash } from 'react-icons/bs'
import { AiFillCloseCircle } from 'react-icons/ai'
import './index.css'

const CartItem = ({
  cartItemDetails,
  updateQuantity,
  deleteItem,
}) => {
  const { id, title, imageUrl, quantity, price } = cartItemDetails

  const onIncrement = () => {
    updateQuantity(id, quantity + 1)
  }

  const onDecrement = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1)
    }
  }

  const onDelete = () => {
    deleteItem(id)
  }

  return (
    
    <li className="cart-item">
      <img
        src={imageUrl}
        alt={title}
        className="cart-product-image"
      />

      <div className="cart-details">
        <h3>{title}</h3>

        <div className="quantity-section">
          <button onClick={onDecrement} className="qty-btn">
            <BsDash />
          </button>
          <span>{quantity}</span>
          <button onClick={onIncrement} className="qty-btn">
            <BsPlus />
          </button>
        </div>
      </div>

      <div className="price-delete-section">
        <p className="item-price">
          Rs {(price * quantity).toFixed(2)}/-
        </p>

        <button className="delete-btn" onClick={onDelete}>
          <AiFillCloseCircle size={20} />
        </button>
      </div>
    </li>
    
  )
}

export default CartItem