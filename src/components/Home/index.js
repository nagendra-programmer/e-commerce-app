import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => (
  <div className="home-page">
    <Header />

    <div className="home-container">
      <div className="home-content">
        <h1 className="home-heading">Clothes That Get YOU Noticed</h1>

        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-img.png"
          alt="clothes that get you noticed"
          className="home-mobile-img"
        />

        <p className="home-description">
          Fashion is part of the daily air and it does not quite help that it
          changes all the time...
        </p>

        <Link to="/products">
          <button type="button" className="shop-now-button">
            Shop Now
          </button>
        </Link>
      </div>

      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-img.png"
        alt="clothes that get you noticed"
        className="home-desktop-img"
      />
    </div>
  </div>
)

export default Home
