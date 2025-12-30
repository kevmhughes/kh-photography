import axios from "axios";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
        bodyParser: false, // Stripe requires raw body
    },
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
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Stripe webhook signature verification failed:", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Only act on completed payments
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;

        try {
            // Build Printful order payload
            const orderPayload = buildPrintfulPayload(paymentIntent.metadata);

            const printfulResponse = await axios.post(
                "https://api.printful.com/orders",
                orderPayload,
                {
                    Authorization: `Bearer ${process.env.VITE_PRINTFUL_KEY}`,
                },
            );

            console.log("Order sent to Printful:", printfulResponse.data);
            return res.status(200).json({ received: true });
        } catch (err) {
            console.error("Failed to send order to Printful:", err.response?.data || err.message);
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

// Build Printful payload from Stripe metadata
function buildPrintfulPayload(metadata) {
    const products = JSON.parse(metadata.products); // your metadata format

    const recipient = {
        name: metadata.customer_name,
        address1: metadata.address_line1, // mandatory
        city: metadata.city,
        country_code: metadata.country,
        zip: metadata.zip,
        email: metadata.customer_email,
    };

    // Include address2 only if provided
    if (metadata.address_line2 && metadata.address_line2.trim() !== "") {
        recipient.address2 = metadata.address_line2;
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
            shipping: metadata.shipping_cost || "0.00",
        },
    };
}
