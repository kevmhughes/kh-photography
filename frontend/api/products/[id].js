import axios from "axios";

export default async function handler(req, res) {
  const { id } = req.query;
  
  try {
    const response = await axios.get(`https://api.printful.com/store/products/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.VITE_PRINTFUL_KEY}` || "Bearer ",
      },
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
