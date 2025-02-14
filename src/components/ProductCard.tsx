'use client'
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface ProductProps {
  image: string;
  title: string;
  price: string;
}

export default function ProductCard({ image, title, price }: ProductProps) {
  const [selectedSize, setSelectedSize] = useState<string>("40");

  return (
    <Card className="w-64 shadow-md border border-gray-200 mx-auto">
      <CardHeader className="p-3">
        <Image
          src={image}
          alt={title}
          width={200}
          height={150}
          className="rounded-md object-cover w-full"
        />
      </CardHeader>
      <CardContent className="p-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <p className="text-lg font-bold mt-1">${price}</p>

        {/* Shoe Size Selection */}
        <div className="mt-3">
          <p className="text-gray-600 text-xs font-medium">Select Size:</p>
          <div className="flex gap-2 mt-1">
            {["39", "40", "41", "42", "43", "44"].map((size) => (
              <button
                key={size}
                className={`w-8 h-8 text-xs font-semibold rounded-md border transition-all ${
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3">
        <Button className="w-full flex items-center gap-1 text-sm p-2">
          <ShoppingCart size={16} /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

