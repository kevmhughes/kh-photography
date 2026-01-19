import { useEffect, useState } from "react";
import { useProducts } from "../../context/ProductContext";
import StickyLinks from "../StickyLinks/StickyLinks";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { runFireworks } from "../../lib/utils";

import toast from "react-hot-toast";

import "./Success.css";

interface LineItem {
  amount_total: number;
  currency: string;
  description: string;
  quantity: number;
  metadata: {
    image?: string | null;
    size?: string | null;
  };
}

interface LineItems {
  data: LineItem[];
}

interface Address {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  postal_code?: string | null;
  state?: string | null;
  country?: string | null;
}

interface ShippingDetails {
  name?: string | null;
  address?: Address | null;
}

interface Session {
  customer_details?: {
    name?: string | null;
    email?: string | null;
  } | null;
  amount_total: number;
  currency: string;
  collected_information?: {
    shipping_details?: ShippingDetails | null;
  } | null;
}

interface CheckoutSession {
  lineItems: LineItems;
  session: Session;
}

const Success = () => {
  const { clearProducts } = useProducts();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session ID");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      const toastId = toast.loading("Fetching your order…");
      try {
        const res = await axios.get(
          `/api/stripe/order-success?session_id=${sessionId}`
        );
        setSession(res.data);
        runFireworks();
        clearProducts();

        toast.success("Order confirmed", {
          id: toastId,
        });
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
        toast.error("Failed to load order", {
          id: toastId,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId]);

  if (loading) return null;
  if (error) return <p className="error">{error}</p>;
  if (!session) return null;

  const customer = session.session.customer_details;
  const shipping = session.session.collected_information?.shipping_details;
  const address = shipping?.address;

  return (
    <>
      <StickyLinks />

      <div className="successs-confirmation-container">
        <div className="success-details-and-order-container">
          <h1 className="success-order-thankyou">Thank you for your order!</h1>

          <div className="success-customer-details-container">
            {/* Customer details */}
            <div className="success-customer-details">
              <h2 className="success-customer-details-title">Your Details</h2>

              {customer?.name && <p>{customer.name}</p>}
              {customer?.email && (
                <p className="success-customer-details-email">
                  {customer.email}
                </p>
              )}
            </div>

            {/* Shipping address */}
            <div className="success-shipping-address-container">
              <h2 className="success-shipping-address-title">
                Shipping Address
              </h2>

              {shipping?.name && (
                <p className="success-shipping-address-name">{shipping.name}</p>
              )}

              {address?.line1 && (
                <p className="success-shipping-address">{address.line1}</p>
              )}

              {address?.line2 && (
                <p className="success-shipping-address">{address.line2}</p>
              )}

              {(address?.postal_code || address?.city) && (
                <p className="success-shipping-address">
                  {address.postal_code} {address.city}
                </p>
              )}

              {address?.country && (
                <p className="success-shipping-address">{address.country}</p>
              )}
            </div>
          </div>

          <div className="success-order-container">
            <div>
              <h2 className="success-order-title">Items Ordered</h2>

              <ul className="success-order-items-container">
                {session.lineItems.data.map((item, index) => (
                  <li key={index} className="success-order-item-container">
                    {item.metadata?.image && (
                      <img
                        src={item.metadata.image}
                        alt={item.description}
                        className="success-order-item-image"
                      />
                    )}

                    <div className="success-order-item-description-container">
                      <h3 className="success-order-item-description">
                        {item.description}
                      </h3>

                      {item.metadata?.size && (
                        <p className="success-order-item-size">
                          Size: {item.metadata.size}
                        </p>
                      )}

                      <p className="success-order-item-quantity">
                        Quantity: {item.quantity}
                      </p>

                      <p className="success-order-item-price">
                        Price: €{(item.amount_total / 100).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="success-order-total-container">
              <h2>Total Paid</h2>
              <span className="success-order-total">
                €{(session.session.amount_total / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;
