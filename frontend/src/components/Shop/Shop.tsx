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
        const res = await axios.get("/api/products");
        console.log(res.data.result);
        setProducts(res.data.result || []);
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
          <Loader />
        </div>
      </>
    );

  if (error)
    return <p className="error">{error}</p>;

  const sortedProducts = [...products].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
  
  return (
    <div>
      <StickyLinks />

      <div className="product-grid">
        {sortedProducts.map((p) => (
          <Link
            to={`/shop/${p.id}`}
            key={p.id}
            className="product-card-link-container"
          >
            <div className="product-card">
              <img
                src={p.thumbnail_url}
                alt={p.name}
                className="product-image"
                loading="lazy"
              />
              <div className="product-card-details-container">
                <h3 className="product-title">{p.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <ShoppingCart />
    </div>
  );
};

export default Shop;
