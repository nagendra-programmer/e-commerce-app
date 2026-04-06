import CartItem from '../CartItem'
import './index.css'

const CartListView = ({ items, updateQuantity, deleteItem }) => (
  <ul className="cart-list">
    {items.map(item => (
      <CartItem
        key={item.id}                 
        cartItemDetails={item}
        updateQuantity={updateQuantity}
        deleteItem={deleteItem}
      />
    ))}
  </ul>
)

export default CartListView