import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req, res) {
  try {
    const { session_id } = req.query;

    console.log("session id", session_id)

    if (!session_id) {
      return res.status(400).json({ error: 'Missing session_id' });
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    })

    /* console.log("session: ", session) */
    console.log("line items: ", lineItems)

    res.status(200).json({ session, lineItems })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
