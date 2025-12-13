import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { products } = req.body;

  if (!products || products.length === 0)
    return res.status(400).json({ error: "No products in the order" });

  try {
    const line_items = products.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.title,
          images: [item.img], 
        },
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
      shipping_address_collection: {
      allowed_countries: ["DE", "FR", "ES", "IT", "NL", "BE"], 
  },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
