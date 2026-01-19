import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get("https://api.printful.com/store/products", {
      headers: {
        Authorization: `Bearer ${process.env.VITE_PRINTFUL_KEY}` || "Bearer DePMIjA1wpgXcMV1e6vb8UE3gK03NJ8fBnnVfZwU",
      },
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}