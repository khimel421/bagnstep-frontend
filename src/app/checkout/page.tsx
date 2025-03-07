"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // ✅ Handle URL parameters & navigation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { toast } from "sonner";
// ✅ Show order confirmation toast

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("product");
  const selectedSize = searchParams.get("size");
  const quantity = Number(searchParams.get("quantity") || 1);

  const { cart, clearCart } = useCart();

  // ✅ Find the selected product in the cart
  const selectedProduct = cart.find((item) => item.id.toString() === productId);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  // ✅ Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle order placement (mocked COD order)
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.address) {
      toast(
        "Missing Information",
      );
      return;
    }

    // ✅ Mock Order Submission (In a real app, send this data to your backend)
    console.log("Order Details:", {
      product: selectedProduct?.name,
      size: selectedSize,
      quantity,
      totalPrice: selectedProduct ? selectedProduct.price * quantity : 0,
      customer: formData,
    });

    // ✅ Show Order Confirmation Toast
    toast(
      "Order Placed Successfully!",
    );

    // ✅ Clear the cart & Redirect to Homepage after order
    clearCart();
    setTimeout(() => router.push("/"), 3000); // Redirect after 3 seconds
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout - Cash on Delivery</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {selectedProduct ? (
            <div className="flex items-center gap-4 border-b pb-4">
              <Image src={selectedProduct.image} alt={selectedProduct.name} width={80} height={80} className="rounded-md" />
              <div>
                <p className="font-semibold">{selectedProduct.name}</p>
                <p className="text-gray-600">Size: {selectedSize}</p>
                <p className="text-gray-600">Quantity: {quantity}</p>
                <p className="font-semibold text-lg">${(selectedProduct.price * quantity).toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <p>No product selected</p>
          )}
        </div>

        {/* Customer Information Form */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Billing & Shipping</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <Input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <Input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
            <Input type="text" name="address" placeholder="Delivery Address" value={formData.address} onChange={handleChange} required />

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Place Order
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
