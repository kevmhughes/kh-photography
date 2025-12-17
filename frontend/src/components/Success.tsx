import { useEffect, useState } from "react";
import { useProducts } from "../context/ProductContext";
import StickyLinks from "../components/StickyLinks/StickyLinks";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { runFireworks } from "../lib/utils";

interface LineItem {
  amount_total: number;
  currency: string;
  description: string;
  quantity: number;
}

interface LineItems {
  data: LineItem[];
}

interface Session {
  customer_details: {
    name: string;
    email: string;
  };
  amount_total: number;
  currency: string;
  collected_information: {
    shipping_details: {
      address: {
        city: string;
        country: string;
        line1: string;
        line2: string | null;
        postal_code: string;
        state: string;
      };
      name: string;
    };
  };
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
      try {
        const res = await axios.get(
          `/api/stripe/order-success?session_id=${sessionId}`
        );
        setSession(res.data);
        runFireworks();
        clearProducts();
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId]);

  if (loading) return <p>Loading your order...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  console.log("session data: ", session);

  return (
    <>
      <>
        <StickyLinks />

        <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-green-600 mb-4">
            🎉 Thank you for your order!
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Your payment was successful. A confirmation email has been sent to{" "}
            <span className="font-medium">
              {session?.session.customer_details.email}
            </span>
            .
          </p>

          {/* Customer details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Customer</h2>
            <p>{session?.session.customer_details.name}</p>
            <p className="text-gray-500">
              {session?.session.customer_details.email}
            </p>
          </div>

          {/* Shipping address */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
            <p>
              {session?.session.collected_information.shipping_details.name}
            </p>
            <p>
              {
                session?.session.collected_information.shipping_details.address
                  .line1
              }
            </p>
            <p>
              {
                session?.session.collected_information.shipping_details.address
                  .postal_code
              }{" "}
              {
                session?.session.collected_information.shipping_details.address
                  .city
              }
            </p>
            <p>
              {
                session?.session.collected_information.shipping_details.address
                  .country
              }
            </p>
          </div>

          {/* Line items */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Items Ordered</h2>

            <ul className="divide-y">
              {session?.lineItems.data.map((item, index) => (
                <li key={index} className="py-4 flex justify-between">
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {(item.amount_total / 100).toFixed(2)}{" "}
                    {item.currency.toUpperCase()}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Total */}
          <div className="border-t pt-4 flex justify-between text-lg font-semibold">
            <span>Total Paid</span>
            <span>
              {(session!.session.amount_total / 100).toFixed(2)}{" "}
              {session!.session.currency.toUpperCase()}
            </span>
          </div>
        </div>
      </>
    </>
  );
};

export default Success;
