"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Order } from "@/types/types";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Extract query param AFTER hydration
  useEffect(() => {
    const id = searchParams.get("orderId");
    console.log("Extracted orderId:", id); // DEBUG
    setOrderId(id);
  }, [searchParams]);

  useEffect(() => {
    // ✅ Don't run if orderId is null or undefined
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order");

        const data: Order = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!orderId) {
    return <div className="text-center mt-10">❌ No order ID found in the URL.</div>;
  }

  if (!order) {
    return <div className="text-center mt-10">❌ Order not found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Order Confirmed!</h1>
      <p className="text-lg">
        Thank you, <strong>{order.customer.name}</strong>!
      </p>
      <p className="text-md mt-2">
        Your order ID is: <strong>{order.id}</strong>
      </p>
      <p className="text-md mt-2">
        Total Amount: <strong>৳ {order.totalAmount}</strong>
      </p>
    </div>
  );
}
