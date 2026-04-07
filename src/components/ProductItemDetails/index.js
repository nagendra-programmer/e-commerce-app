import { Component } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import {ThreeDots} from 'react-loader-spinner'
import { BsPlusSquare, BsDashSquare } from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
    cartMessage:'',
    showCartMessage:false
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

getProductData = async () => {
  const { match } = this.props
  const { id } = match.params

  this.setState({ apiStatus: apiStatusConstants.inProgress })

  const jwtToken = Cookies.get('jwt_token')

  try {
    const response = await fetch(
      `https://e-commerce-app-production-df04.up.railway.app/products/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    )

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = this.getFormattedData(fetchedData)

      const updatedSimilarProductsData =
        fetchedData.similar_products.map(each =>
          this.getFormattedData(each)
        )

      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({ apiStatus: apiStatusConstants.failure })
    }
  } catch (error) {
    this.setState({ apiStatus: apiStatusConstants.failure })
  }
}
   
  startTimer=()=>{
    setTimeout(()=>{
      this.setState({showCartMessage:false})
    },2000)
  }

  //BACKEND ADD TO CART FUNCTION
addToCart = async () => {
  const { productData, quantity } = this.state
  const jwtToken = Cookies.get('jwt_token')

  try {
    const response = await fetch(
      'https://e-commerce-app-production-df04.up.railway.app/api/cart',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          product_id: productData.id,
          quantity: quantity,
        }),
      }
    )

    const data = await response.json()
    console.log(response)
    console.log(data)

    if (response.ok) {
      this.setState({ cartMessage: data.message, showCartMessage: true })
    } else {
      this.setState({ cartMessage: "Failded to add item", showCartMessage: true })
    }

  } catch (error) {
    this.setState({
      cartMessage: "Server is starting... please try again",
      showCartMessage: true,
    })
  }

  this.startTimer()
}

  onDecrementQuantity = () => {
    const { quantity } = this.state
    if (quantity > 1) {
      this.setState(prev => ({ quantity: prev.quantity - 1 }))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prev => ({ quantity: prev.quantity + 1 }))
  }

 renderLoadingView = () => (
    <div className="products-details-loader-container">
      <ThreeDots
        height="50"
        width="50"
        color="#0b69ff"
        visible={true}
      />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">
        Product Not Found
      </h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetailsView = () => {
    const { productData, quantity, similarProductsData ,cartMessage,showCartMessage} = this.state

    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img
            src={imageUrl}
            alt="product"
            className="product-image"
          />

          <div className="product">
            <h1 className="product-name">{title}</h1>
            <p className="price-details">Rs {price}/-</p>

            <div className="rating-and-reviews-count">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews-count">
                {totalReviews} Reviews
              </p>
            </div>

            <p className="product-description">{description}</p>

            <div className="label-value-container">
              <p className="label">Available:</p>
              <p className="value">{availability}</p>
            </div>

            <div className="label-value-container">
              <p className="label">Brand:</p>
              <p className="value">{brand}</p>
            </div>

            <hr className="horizontal-line" />

            <div className="quantity-container">
              <button
                type="button"
                className="quantity-controller-button"
                onClick={this.onDecrementQuantity}
              >
                <BsDashSquare className="quantity-controller-icon" />
              </button>

              <p className="quantity">{quantity}</p>

              <button
                type="button"
                className="quantity-controller-button"
                onClick={this.onIncrementQuantity}
              >
                <BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>

            {/* BACKEND CALL */}
            
            <button
              type="button"
              className="button add-to-cart-btn"
              onClick={this.addToCart}
            >
              ADD TO CART
            </button>
            {showCartMessage && (<p className="cart-message">{cartMessage}</p>)} 
          </div>
        </div>

        <h1 className="similar-products-heading">
          Similar Products
        </h1>

        <ul className="similar-products-list">
          {similarProductsData.map(each => (
            <SimilarProductItem
              key={each.id}
              productDetails={each}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const { apiStatus } = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails

