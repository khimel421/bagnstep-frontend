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

interface ProductSize {
  id: string;
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  images: string[]; // Images now correctly handled as an array
  sizes: ProductSize[];
}

export default function ProductDetailPage() {
  const { id: product_id } = useParams();
  const router = useRouter();
  const productId = String(product_id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product");
  
        const data: Product = await response.json();
  
        // Ensure images are an array
        if (!Array.isArray(data.images)) {
          console.warn("Images are not an array. Check API response format.");
          data.images = [];
        }
  
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Product not found or API error.");
      } finally {
        setLoading(false);
      }
    };
  
    if (productId) fetchProduct();
  }, [productId]);
  

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="flex justify-center items-center min-h-screen md:p-6 ">
      <div className="mb-14 w-full p-2 md:p-6 rounded-2xl bg-white flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8">
        {/* Product Image */}
        <ProductImageSlider product={{ product_name: product.name, images: product.images }} />

        {/* Product Details */}
        <div className="p-4 flex flex-col">
          <Breadcrumb />
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-3xl font-bold">${product.price}</p>

          {/* Sizes Selection */}
          <div className="mt-4">
            <p className="font-semibold text-xl">Select Size:</p>
            <div className="flex gap-2 mt-2">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  className={`px-3 py-1 border rounded-md text-xl transition-all duration-200 ${
                    selectedSize?.id === size.id
                      ? "bg-black text-white border-black"
                      : size.stock > 0
                      ? "hover:bg-gray-200"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={size.stock === 0}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.size} {size.stock === 0 && "(Out of Stock)"}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-start mt-4 gap-3">
            <label className="font-semibold text-xl">Quantity: </label>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8"
            >
              <Minus size={16} />
            </Button>
            <span className="text-lg font-semibold">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (selectedSize && quantity < selectedSize.stock) {
                  setQuantity((prev) => prev + 1);
                }
              }}
              className="w-8 h-8"
            >
              <Plus size={16} />
            </Button>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {/* Add to Cart Button */}
            <Button
              variant="custom"
              onClick={() => {
                if (!selectedSize) {
                  toast.warning("Please select a size before adding to cart!");
                  return;
                }
                if (quantity > selectedSize.stock) {
                  toast.error("Not enough stock available.");
                  return;
                }
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0],
                  size: selectedSize.size,
                  quantity,
                });
              }}
              size="lg"
              className={`w-full mt-6 flex items-center gap-2 ${
                !selectedSize ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
            >
              <ShoppingCart size={16} /> ADD {quantity} TO CART
            </Button>

            {/* Buy Now Button */}
            <motion.div className="w-full">
              <Button
                variant="custom"
                size="lg"
                className={`w-full mt-6 flex items-center gap-2 ${
                  !selectedSize ? "bg-gray-400 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (!selectedSize) {
                    toast.warning("Size Not Selected", {
                      description: "Please select a shoe size before proceeding.",
                    });
                    return;
                  }
                  router.push(
                    `/checkout?product=${product.id}&size=${selectedSize.size}&quantity=${quantity}`
                  );
                }}
              >
                BUY NOW
              </Button>
            </motion.div>
          </div>

          {/* Additional Details */}
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p className="text-lg">
              <span className="font-semibold">Category:</span> {product.category}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Detail:</span> {product.description} 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
