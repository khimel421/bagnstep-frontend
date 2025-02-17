'use client'
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, ShoppingCart } from "lucide-react";

interface ProductProps {
  id: number;
  image: string;
  title: string;
  price: number;
  product_code: string;
  product_name: string;
  sizes: string[];
}


export default function ProductCard({ image, product_code, product_name, price, sizes, id }: ProductProps) {

  const [selectedSize, setSelectedSize] = useState<string>("40");

  return (


        <Card className="min-w-44 shadow-md border border-gray-200 flex flex-col">
          <CardHeader className="p-3">
            <Image
              src={image}
              alt={'shoe'}
              width={200}
              height={150}
              className="rounded-md object-cover w-full"
            />
          </CardHeader>

          {/* Ensuring all cards have the same height */}
          <CardContent className="p-3 min-h-[120px] flex flex-col justify-between">
            <CardTitle className="text-sm font-semibold text-center">
              Product code: {product_code} {product_name}
            </CardTitle>
            <p className="text-lg font-bold mt-1 text-center">${price}</p>

            {/* Shoe Size Selection */}
            <div className="mt-3 flex-grow">
              <div className="flex mt-1 flex-wrap gap-1 justify-center">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`w-8 h-8 text-xs font-semibold rounded-md border transition-all ${selectedSize === size
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

          {/* Add to Cart Button will always be aligned */}
          <CardFooter className="p-3 mt-auto">
            <Button className="w-full flex items-center gap-1 text-sm p-2">
              <ShoppingCart size={16} /> Add to Cart
            </Button>
          </CardFooter>
        </Card>




  );
}

