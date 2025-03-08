"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner"; // ✅ Import Sonner Toast
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string | null | undefined;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [selectedValue, setSelectedValue] = useState("70"); // ✅ State to store selected value
  const productId = searchParams.get("product");
  const selectedSize = searchParams.get("size");
  const quantity = Number(searchParams.get("quantity") || 1);

  console.log(selectedValue)

  console.log('selected size :', typeof (selectedSize))
  const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([]);

  useEffect(() => {
    async function fetchProductIfNeeded() {
      if (productId) {
        let product = cart.find((item) => item.id.toString() === productId);

        if (!product) {
          try {
            const response = await fetch("/products.json");
            const data = await response.json();
            product = data.find((p: CartItem) => p.id.toString() === productId);
          } catch (error) {
            console.error("Error fetching product:", error);
          }
        }

        if (product) {
          setSelectedProducts([
            {
              ...product,
              size: selectedSize,
              quantity: quantity,
            },
          ]);
        }
      } else {
        setSelectedProducts(cart);
      }
    }

    fetchProductIfNeeded();
  }, [productId, cart, selectedSize, quantity]);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.address) {
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
    setTimeout(() => router.push("/"), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout - Cash on Delivery</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {selectedProducts.length > 0 ? (
            selectedProducts.map((product) => (
              <div key={`${product.id}-${product.size}`} className="flex items-center gap-4 border-b pb-4">
                <Image src={product.image} alt={"shoe"} width={80} height={80} className="rounded-md" />
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
          {/*  Total Price ............ */}
          <p className="flex justify-between font-semibold mt-4 border-b pb-4">
            <span className="font-semibold">Sub total: </span>
            {selectedProducts.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}৳
          </p>

          {/* Shipping cost */}
          <div className="flex justify-between font-semibold mt-4 border-b pb-4">
            <span className="font-semibold">Shipping: </span>
            <RadioGroup defaultValue="70" onValueChange={(value) => { setSelectedValue(value) }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="70" id="option-one" />
                <Label htmlFor="70">Inside Dhaka : <span className="font-semibold">70৳ </span> </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="130" id="option-two" />
                <Label htmlFor="option-two">Outside Dhaka: <span className="font-semibold">130.00৳ </span></Label>
              </div>
            </RadioGroup>
          </div>

          {/* Total price with delivery cost ............ */}
          <div>
            <p className="flex justify-between font-semibold mt-4 border-b pb-4">
              <span className="font-semibold">Sub total: </span>
              {selectedProducts.reduce((total, item) => total + item.price * item.quantity, Number(selectedValue)).toFixed(2)}৳
            </p>
          </div>
        </div>

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
