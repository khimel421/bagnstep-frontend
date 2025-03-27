"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string | null;
}

export default function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const productId = searchParams.get("product");
  const selectedSize = searchParams.get("size");
  const quantity = Number(searchParams.get("quantity")) || 1;

  console.log(cart)

  const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([]);
  const [selectedShipping, setSelectedShipping] = useState("70");
  const [formData, setFormData] = useState({ name: "", mobile: "", address: "" });

  // Fetch product if not in cart
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductIfNeeded() {
      if (cart.length === 0) return;
      
      let products = [];
      if (productId) {
        let product = cart.find((item) => item.id === productId);
        if (!product) {
          try {
            const response = await fetch("/products.json");
            const data = await response.json();
            product = data.find((p: CartItem) => p.id === productId);
          } catch (error) {
            console.error("Error fetching product:", error);
          }
        }
        products = product ? [{ ...product, size: selectedSize, quantity }] : [];
      } else {
        products = cart;
      }
  
      setSelectedProducts(products);
      setLoading(false);
    }
  
    fetchProductIfNeeded();
  }, [productId, cart, selectedSize, quantity]);
  
  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, mobile, address } = formData;

    if (!name || !mobile || !address) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    console.log("Order Details:", {
      products: selectedProducts,
      customer: formData,
    });

    toast.success("Order Placed Successfully!", {
      description: "Your order has been placed. We will contact you soon.",
    });

    clearCart();
    setTimeout(() => router.push("/"), 2000);
  };

  const subTotal = selectedProducts.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subTotal + Number(selectedShipping);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout - Cash on Delivery</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {selectedProducts.length > 0 ? (
            selectedProducts.map((product) => (
              <div key={`${product.id}-${product.size}`} className="flex items-center gap-4 border-b pb-4">
                <Image src={product.image} alt={product.name} width={80} height={80} className="rounded-md" />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  {product.size && <p className="text-gray-600">Size: {product.size}</p>}
                  <p className="text-gray-600">Quantity: {product.quantity}</p>
                  <p className="font-semibold text-lg">{(product.price * product.quantity).toFixed(2)}৳</p>
                </div>
              </div>
            ))
          ) : (
            <p>No products selected</p>
          )}

          <p className="flex justify-between font-semibold mt-4 border-b pb-4">
            <span>Subtotal:</span> {subTotal.toFixed(2)}৳
          </p>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Shipping:</h3>
            <RadioGroup defaultValue="70" onValueChange={setSelectedShipping}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="70" id="inside-dhaka" />
                <Label htmlFor="inside-dhaka">Inside Dhaka: <span className="font-semibold">70৳</span></Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="130" id="outside-dhaka" />
                <Label htmlFor="outside-dhaka">Outside Dhaka: <span className="font-semibold">130৳</span></Label>
              </div>
            </RadioGroup>
          </div>

          <p className="flex justify-between font-semibold mt-4 border-b pb-4">
            <span>Total:</span> {total.toFixed(2)}৳
          </p>
        </div>

        {/* Billing & Shipping Form */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Billing & Shipping</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <Input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <Input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
            <Input type="text" name="address" placeholder="Delivery Address" value={formData.address} onChange={handleChange} required />
            <p className="text-sm text-gray-600">
              কোন প্রকার এডভান্স পেমেন্ট ছাড়াই সারাদেশে হোম ডেলিভারি। অর্ডার করুন নিশ্চিন্তে!
            </p>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Place Order</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
