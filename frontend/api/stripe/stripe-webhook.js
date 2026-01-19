import axios from "axios";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    ""
);

export const config = {
  api: { bodyParser: false }, // REQUIRED for Stripe webhooks
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ||
        ""
    );
  } catch (err) {
    console.error("❌ Stripe webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Webhook received:", event.type);

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      // 🔑 FETCH FULL SESSION WITH LINE ITEMS
      const fullSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items"] }
      );

      console.log("=== FULL SESSION ===");
      console.log(JSON.stringify(fullSession, null, 2));
      console.log("====================");

      const orderPayload = buildPrintfulPayload(fullSession);

      console.log("=== PRINTFUL PAYLOAD ===");
      console.log(JSON.stringify(orderPayload, null, 2));
      console.log("========================");

      const printfulResponse = await axios.post(
        "https://api.printful.com/orders",
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${
              process.env.VITE_PRINTFUL_KEY ||
              ""
            }`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Order sent to Printful:", printfulResponse.data);
      return res.status(200).json({ received: true });
    } catch (err) {
      console.error(
        "❌ Failed to create Printful order:",
        err.response?.data || err.message
      );
      return res.status(500).json({ error: "Printful order failed" });
    }
  }

  res.status(200).json({ received: true });
}

/* ---------------- HELPERS ---------------- */

async function buffer(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/* -------- BUILD PRINTFUL PAYLOAD -------- */

function buildPrintfulPayload(session) {
  const products = JSON.parse(session.metadata.products || "[]");

  const shipping =
    session.shipping_details ||
    session.collected_information?.shipping_details ||
    null;

  const address =
    shipping?.address ||
    session.customer_details?.address ||
    null;

  if (!address) {
    throw new Error("No shipping address found in Checkout Session");
  }

  const recipient = {
    name: shipping?.name || session.customer_details?.name || "Unknown",
    address1: address.line1,
    city: address.city,
    country_code: address.country,
    zip: address.postal_code,
    email:
      session.customer_details?.email ||
      session.customer_email ||
      "unknown@example.com",
  };

  if (address.line2) {
    recipient.address2 = address.line2;
  }

  const items = products.map((p) => ({
    variant_id: p.variantId,
    quantity: p.quantity,
    retail_price: p.retailPrice.toString(),
    currency: p.currency || "EUR",
    files: [{ id: p.fileId }],
    sku: p.sku,
  }));

  return {
    confirm: false, // keep false for now
    recipient,
    items,
    retail_costs: {
      shipping: "0.00",
    },
  };
}

