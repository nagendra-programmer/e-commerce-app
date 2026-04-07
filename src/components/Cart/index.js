import { Component } from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import CartListView from '../CartListView'
import EmptyCartView from '../EmptyCartView'
import './index.css'

class Cart extends Component {
  state = {
    items: [],
    grandTotal: 0,
    totalItems: 0,
    isLoading: true,
  }

  componentDidMount() {
    this.getCart()
  }

  getCart = async () => {
    const jwtToken = Cookies.get('jwt_token')

    try {
      const response = await fetch(
        'https://e-commerce-app-production-df04.up.railway.app/api/cart',
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )

      const data = await response.json()

      if (response.ok) {
        const formattedItems = data.items.map(item => ({
          id: item.item_id,
          title: item.title,
          imageUrl: item.image_url,
          price: Number(item.price),
          quantity: Number(item.quantity),
        }))

        this.setState({
          items: formattedItems,
          grandTotal: Number(data.grandTotal) || 0,
          totalItems: data.totalItems,
          isLoading: false,
        })
      } else {
        this.setState({ isLoading: false })
      }
    } catch (error) {
      console.error(error)
      this.setState({ isLoading: false })
    }
  }

  updateQuantity = async (itemId, quantity) => {
    const jwtToken = Cookies.get('jwt_token')

    try {
      await fetch(
        `https://e-commerce-app-production-df04.up.railway.app/api/cart/${itemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ quantity }),
        }
      )
    } catch (error) {
      console.error(error)
    }

    this.getCart()
  }

  deleteItem = async itemId => {
    const jwtToken = Cookies.get('jwt_token')

    try {
      await fetch(
        `https://e-commerce-app-production-df04.up.railway.app/api/cart/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
    } catch (error) {
      console.error(error)
    }

    this.getCart()
  }

  clearCart = async () => {
    const jwtToken = Cookies.get('jwt_token')

    try {
      await fetch(
        'https://e-commerce-app-production-df04.up.railway.app/api/cart',
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
    } catch (error) {
      console.error(error)
    }

    this.getCart()
  }

  render() {
    const { items, grandTotal, totalItems, isLoading } = this.state

    if (isLoading) {
      return (
        <>
          <Header />
          <p className="loading-text">Loading...</p>
        </>
      )
    }

    return (
      <>
        <div className="cart-page">
          <Header />

          <div className="cart-container">
            <div className="cart-content-container">

              <div className="cart-top-bar">
                <h1 className="cart-heading">My Cart</h1>
                {items.length > 0 && (
                  <button
                    onClick={this.clearCart}
                    className="clear-cart-btn"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <EmptyCartView />
              ) : (
                <div className="cart-body">
                  <CartListView
                    items={items}
                    updateQuantity={this.updateQuantity}
                    deleteItem={this.deleteItem}
                  />
                </div>
              )}

            </div>
          </div>

          {items.length > 0 && (
            <div className="cart-footer">
              <div className="cart-summary">
                <p className="summary-text">
                  Total Items: {totalItems}
                </p>

                <p className="summary-total">
                  Grand Total: Rs {grandTotal.toFixed(2)}/-
                </p>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
}

export default Cart