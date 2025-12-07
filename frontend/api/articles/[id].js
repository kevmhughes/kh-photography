/* VERCEL DEPLOY  */
/* VERCEL DEPLOY  */
/* VERCEL DEPLOY  */
/* 1. Don't expose the token when deploying */
/* 2. add frontend folder to deploy route */

import axios from "axios";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await axios.get(`https://api.spreadconnect.app/articles/${id}`, {
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

/* VERCEL DEV  */
/* VERCEL DEV  */
/* VERCEL DEV  */

/* import axios from "axios";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await axios.get(
      `https://api.spreadconnect.app/articles/${id}`,
      {
        headers: {
          "X-SPOD-ACCESS-TOKEN": "",
        }
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
} */
