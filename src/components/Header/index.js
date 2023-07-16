import './index.css'
import {Link} from 'react-router-dom'

import {Component} from 'react'

class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <div className="logo-container">
          <img
            src="https://res.cloudinary.com/diinjqsug/image/upload/v1688635612/Frame_274_a4kbyj.svg"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="heading">Testy Kitchens</h1>
        </div>
        <div className="button-container">
          <ul className="list-container">
            <Link to="./">
              <li className="home-text">Home</li>
            </Link>
            <li className="cart-text">Cart</li>
          </ul>

          <button type="button" className="button">
            Logout
          </button>
        </div>
      </div>
    )
  }
}
export default Header
