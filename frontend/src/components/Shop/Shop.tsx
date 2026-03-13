import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StickyLinks from "../StickyLinks/StickyLinks";
import Glass from "../../assets/glass.svg";
import Loader from "../Loader/Loader";
import "./Shop.css";
import type { PrintfulProduct } from "../../types/product.types";

const Shop = () => {
  const [products, setProducts] = useState<PrintfulProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get("/api/products");
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
        <StickyLinks setSearch={setSearch} />
        <div>
          <Loader />
        </div>
      </>
    );

  if (error) return <p className="error">{error}</p>;

  // Filter products by search text
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Sort products alphabetically
  const sortedProducts = [...filteredProducts].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );

  return (
    <div>
      <StickyLinks setSearch={setSearch} />

      {location.pathname === "/shop" && (
        <div className="search-bar-container-mobile">
          <input
            type="text"
            onChange={(e) => setSearch?.(e.target.value)}
            className="search-input-mobile"
          />
          <img
            src={Glass}
            alt="Search bar icon"
            className="search-bar-icon-mobile"
          />
        </div>
      )}

      {sortedProducts.length === 0 && (
        <p className="no-search-results-text">
          Sorry, no results were found.
        </p>
      )}

      <div className="product-grid">
        {sortedProducts.length > 0 &&
          sortedProducts.map((p) => {
            const name = p.name.split("-")[0]?.trim();
            const type = p.name.split("-")[1]?.trim();

            return (
              <Link
                to={`/shop/${p.id}`}
                key={p.id}
                className="product-card-link-container"
              >
                <div className="product-card">
                  {type && <div className="product-type-label">{type}</div>}

                  <img
                    src={p.thumbnail_url}
                    alt={name}
                    className="product-image"
                    loading="lazy"
                  />

                  <div className="product-card-details-container">
                    <h3 className="product-title">{name}</h3>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Shop;
