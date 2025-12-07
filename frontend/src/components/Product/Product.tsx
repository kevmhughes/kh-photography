import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StickyLinks from "../StickyLinks/StickyLinks";
import Loader from "../Loader/Loader";
import axios from "axios";
import "./Product.css";
import ShoppingCart from "../ShoppingCart/ShoppingCart"

interface ProductImage {
  imageUrl: string;
  perspective: string
}

interface ProductVariant {
  d2cPrice: number;
  productTypeName: string;
  stock: number;
}

interface ProductDetail {
  title: string;
  description: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

const Product = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null
  );

  console.log("product detail:", productDetail);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/api/articles/${id}`);
        setProductDetail(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  const handleAddProduct = () => {
    if (numberOfProducts >= 9) {
      setNumberOfProducts(9);
    } else {
      setNumberOfProducts((prev) => prev + 1);
    }
  };

  const handleRemoveProduct = () => {
    if (numberOfProducts <= 0) {
      setNumberOfProducts(0);
    } else {
      setNumberOfProducts((prev) => prev - 1);
    }
  };

  const quantity = productDetail?.variants?.[0]?.stock ?? 0;
  const inStock = quantity > 0;

  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

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
          src={productDetail?.images[0].imageUrl}
          alt={productDetail?.title}
          className="product-details-image"
        />
        <div className="product-details-information-container">
          <h1 className="product-details-title">{productDetail?.title}</h1>
          <p className="product-details-description">
            {productDetail?.description}
          </p>
          <p className="product-details-description">
            {productDetail?.variants[0].productTypeName}
          </p>
          <p className="product-details-description isit-in-stock">
            {inStock ? "In stock" : "Out of stock"}
          </p>
          <p className="product-details-price">
            €{productDetail?.variants[0].d2cPrice}
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
              onClick={() => console.log("hey")}
            >
              Add To Cart
            </button>
            <button
              className={`cart-button buy-now-cart-button ${
                inStock ? "" : "disabled"
              }`}
              disabled={!inStock}
              onClick={() => console.log("hey")}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <ShoppingCart />
      {/* {productDetail?.images?.length > 0 && productDetail?.images.map((i) => (
        <div>
          <img src={i.imageUrl} alt={i.perspective} />
        </div>
      ))} */}
    </>
  );
};

export default Product;
