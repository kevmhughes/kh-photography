import Cart from "../../assets/cart.svg"
import "./ShoppingCart.css"

const ShoppingCart = () => {
  return (
    <div className="shopping-cart-icon-container">
      <img src={Cart} alt="shopping cart icon" className="shopping-cart-icon" />
      <div className="shopping-cart-number">0</div>
    </div>
  )
}

export default ShoppingCart
