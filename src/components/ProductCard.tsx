'use client';
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

interface Size {
  id: string;
  productId: string;
  size: string;
  stock: number;
}

interface ProductProps {
  id: number;
  name:string;
  images?: string[];
  title?: string;
  price?: number;

  sizes?: Size[];
}

export default function ProductCard({ images = [], name = "", price = 0, sizes = [], id }: ProductProps) {
  // 🛑 Prevent rendering if there are no available sizes

  const [selectedSize, setSelectedSize] = useState<string>("");
  if (!sizes || sizes.length === 0) return null;

  console.log(id)



  // ✅ Use fallback image if images array is empty
  const validImage = images.length > 0 ? images[0] : "/fallback-image.jpg";

  return (
    <Card className="min-w-44 shadow-md border border-gray-200 flex flex-col">

      <Link href={`/products/${id}`}>
        <CardHeader className="p-3">
          <Image
            src={validImage}
            alt={"product"}
            width={200}
            height={2}
            className="rounded-md object-cover w-full h-64"
          />
        </CardHeader>
      </Link>

      <CardContent className="p-3 min-h-[120px] flex flex-col justify-between">
        <Link href={`/products/${id}`}>
          <p className="text-sm font-semibold text-center">{name}</p>
        </Link>
        <p className="text-lg font-bold mt-1 text-center">${price}</p>

        {/* Shoe Size Selection */}
        <div className="mt-3 flex-grow">
          <div className="flex mt-1 flex-wrap gap-1 justify-center">
            {sizes.map((sizeObj, idx) => (
              <button
                key={idx}
                className={`w-8 h-8 text-xs font-semibold rounded-md border transition-all ${
                  selectedSize === sizeObj.size
                    ? "bg-black text-white border-black"
                    : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedSize(sizeObj.size)}
              >
                {sizeObj.size}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
