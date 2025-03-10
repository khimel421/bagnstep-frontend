"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider"; // Import ShadCN Slider
import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json";

export default function Products() {
  // Set initial price range (adjust min & max based on your products)
  const [priceRange, setPriceRange] = useState([10, 200]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // Store selected shoe size

  // Extract unique shoe sizes from the product list
  const uniqueSizes = Array.from(
    new Set(products.flatMap((product) => product.sizes))
  );

  // Filter products based on price and selected shoe size
  const filteredProducts = products.filter(
    (product) =>
      product.price >= priceRange[0] &&
      product.price <= priceRange[1] &&
      (!selectedSize || product.sizes.includes(selectedSize)) // Size filter
  );

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Price Range Slider */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <Slider
          min={10}
          max={200}
          step={10}
          defaultValue={[10, 200]}
          value={priceRange}
          onValueChange={setPriceRange} // Updates price range dynamically
        />
      </div>

      {/* Shoe Size Filter */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Select Shoe Size:</label>
        <div className="flex gap-2 flex-wrap">
          {uniqueSizes.map((size) => (
            <button
              key={size}
              className={`px-4 py-2 border rounded ${
                selectedSize === size ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setSelectedSize(size === selectedSize ? null : size)} // Toggle size
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(({ product_code, product_name, price,image, sizes,id }) => (
            <ProductCard
              key={product_code}
              product_code={product_code}
              product_name={product_name}
              image={image}
              title={product_name}
              sizes={sizes}
              price={price}
              id={id}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-4">
            No products found in this price range and size.
          </p>
        )}
      </div>
    </div>
  );
}
