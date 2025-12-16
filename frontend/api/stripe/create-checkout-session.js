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
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      mode: "payment",
      line_items,
      custom_text: {
          submit: {
            message: "**For testing purposes:** fill in all the card number fields using a series of the numbers 4 and 2. (eg. 4242 4242 4242 4242)"
          }
        },
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
      shipping_address_collection: {
        allowed_countries: ["ES"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Standard shipping",
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "eur",
            },
          }
        }
      ]
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
