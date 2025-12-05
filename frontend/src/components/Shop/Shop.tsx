import { useEffect, useState } from "react";
import axios from "axios";
import StickyLinks from "../StickyLinks/StickyLinks";
import "./Shop.css"

interface SpreadProduct {
  id: number;
  title: string;
  images: { imageUrl: string }[];
  price: {
    value: number;
    currency: string;
  };
  variants?: {
    d2cPrice: string;
  }[];
}

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
        console.log("API response:", res.data.items);

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

  if (loading) return <p style={{ textAlign: "center" }}>Loading products…</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div>
      <StickyLinks />

      <div
        className="product-grid"
      >
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img
              src={p.images?.[0]?.imageUrl}
              alt={p.title}
              style={{ height: "20rem" }}
              className="product-image"
            />
            <h3 className="product-title">{p.title}</h3>
            <p className="product-price">€{p.variants?.[0]?.d2cPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
