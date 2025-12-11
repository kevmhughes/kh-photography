import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StickyLinks from "../StickyLinks/StickyLinks";
import Loader from "../Loader/Loader";
import axios from "axios";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import { useProducts } from "../../context/ProductContext";
import "./Product.css";
import type { SpreadProduct } from "../../types/product.types";

const Product = () => {
  const { id } = useParams();
  const { addProduct, cartIsVisible, handleCartVisibility } = useProducts();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [productDetail, setProductDetail] = useState<SpreadProduct | null>(
    null
  );

  /*  const { products, cartTotal, totalItems } = useProducts();

  console.log("Current cart products:", products);
  console.log("Total items in cart:", totalItems);
  console.log("Cart total:", cartTotal);
  console.log("Product details", productDetail);
 */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/api/articles/${id}`);
        setProductDetail(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to fetch product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  const handleAddProduct = () => {
    setNumberOfProducts((prev) => Math.min(prev + 1, 9));
  };

  const handleRemoveProduct = () => {
    setNumberOfProducts((prev) => Math.max(prev - 1, 0));
  };

  const handleAddToCart = () => {
    if (!productDetail || numberOfProducts === 0) return;

    addProduct({
      productId: productDetail.id,
      price: productDetail?.variants?.[0]?.d2cPrice,
      quantity: numberOfProducts,
      img: productDetail.images[0]?.imageUrl || "",
      title: productDetail?.title || "",
    });

    setNumberOfProducts(0);
  };

  const handleBuyNow = () => {
    if (!productDetail || numberOfProducts === 0) return;

    addProduct({
      productId: productDetail.id,
      price: productDetail?.variants?.[0]?.d2cPrice,
      quantity: numberOfProducts,
      img: productDetail.images[0]?.imageUrl || "",
      title: productDetail?.title || "",
    });

    setNumberOfProducts(0);
    handleCartVisibility();
  };

  const quantityInStock = productDetail?.variants?.[0]?.stock ?? 0;
  const inStock = quantityInStock > 0;

  if (error)
    return <p style={{ color: "#f02d34", textAlign: "center" }}>{error}</p>;

  if (loading)
    return (
      <>
        <StickyLinks />
        <Loader />
      </>
    );

  return (
    <>
      <StickyLinks />
      <div className="product-details-container">
        <img
          src={productDetail?.images[0]?.imageUrl}
          alt={productDetail?.title}
          className="product-details-image"
        />
        <div className="product-details-information-container">
          <h1 className="product-details-title">{productDetail?.title}</h1>
          <p className="product-details-description">
            {productDetail?.description}
          </p>
          <p className="product-details-description">
            {productDetail?.variants?.[0]?.productTypeName}
          </p>
          <p className={`product-details-description isit-in-stock`}>
            {inStock ? "In stock" : "Out of stock"}
          </p>
          <p className="product-details-price">
            €{productDetail?.variants?.[0]?.d2cPrice}
          </p>

          <div className="product-quantity-container">
            <h2 className="product-quantity-title">Quantity: </h2>
            <div className="product-quantity-buttons-container">
              <div
                className="button remove-product-button"
                onClick={handleRemoveProduct}
              >
                -
              </div>
              <div className="product-quantity">{numberOfProducts}</div>
              <div
                className="button add-product-button"
                onClick={handleAddProduct}
              >
                +
              </div>
            </div>
          </div>

          <div className="product-cart-button-container">
            <button
              className={`cart-button add-to-cart-button ${
                inStock ? "" : "disabled"
              }`}
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>
            <button
              className={`cart-button buy-now-cart-button ${
                inStock ? "" : "disabled"
              }`}
              disabled={!inStock}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <ShoppingCart />
    </>
  );
};

export default Product;
