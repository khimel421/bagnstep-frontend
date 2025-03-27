"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

// Define Product Type
interface Size {
  id: string;
  productId: string;
  size: string;
  stock: number;
}

interface Product {
  id: number;
  name:string;
  images: string[];
  title: string;
  price: number;
  product_name: string;
  sizes: Size[];  // ✅ Now it correctly expects an array of size objects
}


export default function Products() {
  // State to store products fetched from backend
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data: Product[] = await response.json();
        console.log("Fetched Products:", data); // 🐛 Debugging log
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log(products)

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Product List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map(({ id, name, price, images, sizes  }) => (
              <ProductCard
                key={id} // ✅ Unique Key
                id={id}

                product_name={name}
                images={images}
                title={name}
                sizes={sizes}
                price={price}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-4">No products available.</p>
          )}
        </div>
      )}
    </div>
  );
}
