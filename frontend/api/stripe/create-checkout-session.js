import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
  ""
);

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
        unit_amount: Math.round(item.retailPrice * 100),
      },
      adjustable_quantity: {
        enabled: true,
        minimum: 0,
      },
      quantity: item.quantity,
      metadata: {
        size: item.size,
        image: item.img,
      },
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      mode: "payment",
      line_items,
      metadata: {
        products: JSON.stringify(products),
      },
      custom_text: {
        submit: {
          message:
            "**For testing purposes:** fill in the card number field using a series of the numbers 4 and 2 (eg. 4242 4242 4242 4242). Put a future date and three numbers in the other fields",
        },
      },
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/shop`,
      shipping_address_collection: {
        allowed_countries: ["ES", "BE","BG", "HR", "CY", "CZ", "EE", "FI", "FR",
          "DE", "GI", "GR", "HU", "IE", "IT", "LI", "LU", "NL", "NO",
          "PL", "PT", "RO", "SK", "SI", "SE", "CH", "GB"],
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
          },
        },
      ],
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
