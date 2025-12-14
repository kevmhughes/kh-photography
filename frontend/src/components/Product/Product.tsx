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
  const { addProduct, handleCartVisibility } = useProducts();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numberOfProducts, setNumberOfProducts] = useState(1);
  const [productDetail, setProductDetail] = useState<SpreadProduct | null>(
    null
  );
  const [viewedProductIndex, setViewedProductIndex] = useState(0);

  const currentVariant = productDetail?.sync_variants?.[viewedProductIndex];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/api/products/${id}`);
        console.log("data", res.data.result);
        setProductDetail(res.data.result);
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
    setNumberOfProducts((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    if (!productDetail || numberOfProducts === 0) return;

    if (!currentVariant || !currentVariant.id || !currentVariant.retail_price)
      return;

    addProduct({
      productId: currentVariant?.id,
      price: Number(currentVariant.retail_price),
      quantity: numberOfProducts,
      img: currentVariant.files[1]?.preview_url || "",
      title: productDetail?.sync_product.name || "",
      size: currentVariant?.size,
    });

    setNumberOfProducts(1);
  };

  const handleBuyNow = () => {
    if (!productDetail || numberOfProducts === 0) return;

    if (!currentVariant || !currentVariant.id || !currentVariant.retail_price)
      return;

    addProduct({
      productId: currentVariant?.id,
      price: Number(currentVariant.retail_price),
      quantity: numberOfProducts,
      img: currentVariant.files[1]?.preview_url || "",
      title: productDetail?.sync_product.name || "",
      size: currentVariant?.size,
    });

    setNumberOfProducts(1);
    handleCartVisibility();
  };

  const inStock = currentVariant?.availability_status === "active";
  console.log("is it in stock", inStock);

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
        {
          <img
            src={currentVariant?.files[1]?.preview_url}
            alt={productDetail?.sync_product?.name}
            className="product-details-image"
          />
        }

        <div className="product-details-information-and-thumbnails-container">
          <div className="product-details-information-container">
            <h1 className="product-details-title">
              {productDetail?.sync_product.name}
            </h1>
            <p className="product-details-description">
              {currentVariant?.product.name}
            </p>
            <p className={`product-details-description isit-in-stock`}>
              {inStock ? "In stock" : "Out of stock"}
            </p>
            <p className="product-details-price">
              €{currentVariant?.retail_price}
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
          <div className="variant-thumbnails-container">
            {productDetail?.sync_variants.map((item, index) => (
              <div
                key={item.id}
                onClick={() => {
                  setViewedProductIndex(index);
                  console.log("index", index);
                }}
              >
                <img
                  src={item.files[0].thumbnail_url}
                  alt={item.name}
                  className={
                    index === viewedProductIndex
                      ? "variant-thumbnail-active"
                      : "variant-thumbnail"
                  }
                />
                <div>{item.size}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ShoppingCart />
    </>
  );
};

export default Product;
