import axios from "axios";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: { bodyParser: false }, // Stripe requires raw body
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    // Read raw body
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            buf,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Stripe webhook signature verification failed:", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        try {
            // Build Printful order payload from session
            const orderPayload = buildPrintfulPayload(session);

            console.log("Printful payload:", JSON.stringify(orderPayload, null, 2));

            const printfulResponse = await axios.post(
                "https://api.printful.com/orders",
                orderPayload,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.VITE_PRINTFUL_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Order sent to Printful:", printfulResponse.data);
            return res.status(200).json({ received: true });
        } catch (err) {
            console.error(
                "Failed to send order to Printful:",
                err.response?.data || err.message
            );
            return res.status(500).json({ error: "Failed to create Printful order" });
        }
    }

    res.status(200).json({ received: true });
}

// Helper to parse raw request body
async function buffer(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

// Build Printful payload from Checkout Session
function buildPrintfulPayload(session) {
    const products = JSON.parse(session.metadata.products || "[]");

    const recipient = {
        name: session.customer_details?.name || "Unknown",
        address1: session.shipping_details.address.line1,
        city: session.shipping_details.address.city,
        country_code: session.shipping_details.address.country,
        zip: session.shipping_details.address.postal_code,
        email: session.customer_details?.email || session.customer_email,
    };

    if (session.shipping_details.address.line2) {
        recipient.address2 = session.shipping_details.address.line2;
    }

    return {
        confirm: false, // testing mode
        recipient,
        items: products.map((p) => ({
            variant_id: p.variantId,
            quantity: p.quantity,
            retail_price: p.retailPrice.toString(),
            currency: p.currency || "EUR",
            files: [{ id: p.fileId }],
            sku: p.sku,
        })),
        retail_costs: {
            shipping: "0.00",
        },
    };
}
