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

/* import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // loads .env.local locally
console.log("SPREADCONNECT_KEY:", process.env.SPREADCONNECT_KEY); 

export default async function handler(req, res) {
  const token = ""; // Node env variable
  if (!token) {
    console.error("Missing SPREADCONNECT_KEY environment variable!");
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const response = await axios.get("https://api.spreadconnect.app/articles", {
      headers: {
        "X-SPOD-ACCESS-TOKEN": token,
      },
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.error("API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
 */