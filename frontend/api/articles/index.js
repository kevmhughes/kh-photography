import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get("https://api.spreadconnect.app/articles", {
      headers: {
        "X-SPOD-ACCESS-TOKEN": process.env.SPREADCONNECT_KEY,
      },
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
