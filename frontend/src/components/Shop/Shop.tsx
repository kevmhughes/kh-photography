import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StickyLinks from "../StickyLinks/StickyLinks";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import Loader from "../Loader/Loader";
import "./Shop.css";
import type { SpreadProduct } from "../../types/product.types";

const Shop = () => {
  const [products, setProducts] = useState<SpreadProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get("/api/articles");
        setProducts(res.data.items || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <>
        <StickyLinks />
        <div>
          <div style={{ fontSize: "2rem" }}>Loading products...</div>
          <Loader />
        </div>
      </>
    );

  if (error)
    return <p style={{ color: "#f02d34", textAlign: "center" }}>{error}</p>;

  return (
    <div>
      <StickyLinks />

      <div className="product-grid">
        {products.map((p) => (
          <Link
            to={`/shop/${p.id}`}
            key={p.id}
            className="product-card-link-container"
          >
            <div className="product-card">
              <img
                src={p.images?.[0]?.imageUrl}
                alt={p.title}
                className="product-image"
              />
              <h3 className="product-title">{p.title}</h3>
              <p className="product-price">€{p.variants?.[0]?.d2cPrice}</p>
            </div>
          </Link>
        ))}
      </div>
      <ShoppingCart />
    </div>
  );
};

export default Shop;
