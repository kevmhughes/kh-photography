import "./ShoppingCart.css";
import { useProducts } from "../../context/ProductContext";
import Cart from "../../assets/cart.svg";
import Arrow from "../../assets/arrow.svg";
import Delete from "../../assets/delete.svg";
import ShoppingBag from "../../assets/shopping-bag.svg";

import toast from "react-hot-toast";

const ShoppingCart = () => {
  const {
    totalItems,
    products,
    cartTotal,
    removeProduct,
    updateQuantity,
    cartIsVisible,
    handleCartVisibility,
  } = useProducts();

  console.log("products", products);

  const handleCheckout = async () => {
    const toastId = toast.loading("Redirecting to checkout…");

    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      if (!res.ok) {
        throw new Error("Checkout failed");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      toast.error("Unable to start checkout. Please try again.", {
        id: toastId,
      });
    }
  };

  return (
    <>
      {/* Cart Icon */}
      <div
        className="shopping-cart-icon-container"
        onClick={handleCartVisibility}
      >
        {!cartIsVisible && (
          <>
            <img
              src={Cart}
              alt="shopping cart icon"
              className="shopping-cart-icon"
            />
            <div className="shopping-cart-number">{totalItems}</div>
          </>
        )}
      </div>

      {/* Overlay */}
      {cartIsVisible && (
        <div className="overlay active" onClick={handleCartVisibility}></div>
      )}

      {/* Sidebar Cart */}
      <div
        className={
          cartIsVisible ? "shopping-cart-is-visible" : "shopping-cart-is-hidden"
        }
      >
        <div onClick={handleCartVisibility}></div>
        <div className="cart-header" onClick={handleCartVisibility}>
          <img
            src={Arrow}
            className="cart-header-arrow"
            alt="Go back arrow icon"
          />
          <div>
            Your Cart:
            <span style={{ color: "#f02d34", marginLeft: "0.5rem" }}>
              ({totalItems} Items)
            </span>
          </div>
        </div>

        {/* Empty Cart */}
        {totalItems === 0 && (
          <>
            <div className="empty-cart">
              <img
                src={ShoppingBag}
                alt="empty cart icon"
                className="shopping-bag-icon"
              />
              <h3>Your cart is empty!</h3>
            </div>
            <div className="cart-footer-container">
              <div className="cart-footer-total">
                <h3>Total:</h3>
                <h3>€{cartTotal.toFixed(2)}</h3>
              </div>
              <div
                className="cart-footer-button"
                onClick={handleCartVisibility}
              >
                Continue Shopping
              </div>
            </div>
          </>
        )}

        {/* Cart with products */}
        {totalItems > 0 && (
          <>
            <div className="cart-products-list">
              {products.map((p) => (
                <div key={p.productId} className="cart-product-card">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="cart-product-image"
                  />
                  <div className="cart-product-info-container">
                    <div>
                      <div className="cart-product-info">
                        <div>
                          <div className="cart-product-info-title">
                            {p.title}
                          </div>
                          <div className="cart-product-info-size">
                            Size: {p.size}
                          </div>
                        </div>
                        <div className="cart-product-info-price">
                          €{p.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="cart-product-info cart-product-subtotal">
                        <div>Subtotal:</div>
                        <div>€{(p.price * p.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="cart-product-buttons-container">
                      <div className="cart-product-buttons">
                        <div
                          className="cart-product-minus-button"
                          onClick={() => {
                            if (p.quantity > 1)
                              updateQuantity(p.productId, p.quantity - 1);
                          }}
                        >
                          -
                        </div>

                        <div className="cart-product-quantity">
                          {p.quantity}
                        </div>
                        <div
                          className="cart-product-add-button"
                          onClick={() =>
                            updateQuantity(p.productId, p.quantity + 1)
                          }
                        >
                          +
                        </div>
                      </div>
                      <img
                        src={Delete}
                        alt="delete icon"
                        className="cart-product-delete-button"
                        onClick={() => removeProduct(p.productId)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer-container">
              <div className="cart-footer-total">
                <h3>Total:</h3>
                <h3>€{cartTotal.toFixed(2)}</h3>
              </div>
              <div className="cart-footer-button" onClick={handleCheckout}>
                Go To Checkout
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;
