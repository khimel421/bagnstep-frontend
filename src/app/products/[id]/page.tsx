"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import ProductImageSlider from "@/components/ProductImageSlider";
import { motion } from "motion/react";
import Breadcrumb from "@/components/Breadcrumb";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";


interface Product {
  id: number;
  product_code: string;
  product_name: string;
  price: number;
  sizes: string[];
  image: string;
  description: string;
  origin: string;
  color: string;
  upper_material: string;
  insole_material: string;
  sole: string;
}

export default function ProductDetailPage() {
  const { id: product_id } = useParams();
  const router = useRouter();
  const productId = Number(product_id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1); // ✅ Added quantity state
  const [shake, setShake] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/products.json"); // Fetching from public folder
        const data: Product[] = await response.json();
        const foundProduct = data.find((p) => p.id === productId);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  const { product_name, price, image, id } = product;


  // Increase Quantity
  const increaseQuantity = () => setQuantity((prev) => prev + 1);

  // Decrease Quantity (Ensures min is 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex justify-center items-center min-h-screen md:p-6">
      <div className="mb-14 w-full p-2 md:p-6 rounded-2xl bg-white flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8">
        {/* Product Image Slider */}
        <ProductImageSlider
          product={{
            product_name: product.product_name,
            images: [
              "https://walkerlifestyle.com/wp-content/uploads/2025/01/581-6-scaled-700x700.jpg",
              "https://walkerlifestyle.com/wp-content/uploads/2025/01/580-2-scaled-700x700.jpg",
              "https://walkerlifestyle.com/wp-content/uploads/2025/01/1-1-scaled-700x700.jpg",
              "https://walkerlifestyle.com/wp-content/uploads/2025/01/578-3-scaled-700x700.jpg",
            ],
          }}
        />

        {/* Product Details */}
        <div className="p-4 flex flex-col">
          <Breadcrumb />
          <h1 className="text-2xl font-bold mb-2">
            Product code: {product.product_code} {product.product_name}
          </h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-3xl font-bold">${product.price}</p>

          {/* Sizes Selection */}
          <div className="mt-4">
            <p className="font-semibold text-xl">Select Size:</p>
            <div className="flex gap-2 mt-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 border rounded-md text-xl transition-all duration-200 ${selectedSize === size
                    ? "bg-black text-white border-black"
                    : "hover:bg-gray-200"
                    }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-start mt-4 gap-3">
            <label className="font-semibold text-xl" htmlFor="">Quantity : </label>
            <Button variant="outline" size="icon" onClick={decreaseQuantity} className="w-8 h-8">
              <Minus size={16} />
            </Button>
            <span className="text-lg font-semibold">{quantity}</span>
            <Button variant="outline" size="icon" onClick={increaseQuantity} className="w-8 h-8">
              <Plus size={16} />
            </Button>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {/* Add to Cart Button */}
            <Button
              onClick={() => {
                if (!selectedSize) {
                  toast.warning("Please select a size before adding to cart!"); // ✅ Show alert if no size is selected
                  return;
                }
                addToCart({
                  id,
                  name: product_name,
                  price,
                  image,
                  size: selectedSize,
                  quantity, // ✅ Include quantity
                });
              }}
              size="lg"
              className={`w-full mt-6 flex items-center gap-2 ${!selectedSize ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900"
                }`}
            // disabled={!selectedSize} // ✅ Disable button if no size is selected
            >
              <ShoppingCart size={16} /> ADD {quantity} TO CART
            </Button>

            {/* Buy Now Button */}
            <motion.div
              className="w-full"
              animate={shake ? { x: [-8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Button
                size="lg"
                className={`w-full mt-6 flex items-center gap-2 
                ${!selectedSize ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-blue-700 text-white"}`}
                onClick={() => {
                  if (!selectedSize) {
                    toast.warning("Size Not Selected", {
                      description: "Please select a shoe size before proceeding.",
                    });
                    return;
                  }
                  router.push(`/checkout?product=${id}&size=${selectedSize}&quantity=${quantity}`);
                }}
              >
                BUY NOW
              </Button>
            </motion.div>
          </div>

          {/* Additional Details */}
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p className="text-lg">
              <span className="font-semibold md:text-lg">Origin:</span> {product.origin}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Color:</span> {product.color}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Upper Material:</span> {product.upper_material}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Insole Material:</span> {product.insole_material}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Sole:</span> {product.sole}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
