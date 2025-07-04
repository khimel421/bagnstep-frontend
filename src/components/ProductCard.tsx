'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCardProps } from "@/types/types";

export default function ProductCard({
  images = [],
  name = "",
  productCode = "",
  price = 0,
  sizes = [],
  id,
  category,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (!sizes || sizes.length === 0) return null;

  const filterSize = sizes.filter((size) => size.stock !== 0)

  const validImage = images.length > 0 ? images[0] : "/fallback-image.jpg";

  return (
    <Card className="group hover:shadow-xl transition-all border rounded-2xl overflow-hidden flex flex-col h-full">
      <Link href={`/products/${id}`}>
        <CardHeader className=" relative">
          <Image
            priority
            placeholder="blur"
            blurDataURL="/249.jpg"
            src={validImage}
            alt={name}
            width={300}
            height={300}
            className="w-full  object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className="absolute top-3 left-3 bg-green-500 text-white">New</Badge>
        </CardHeader>
      </Link>

      <CardContent className="p-4 flex flex-col gap-2 flex-grow">
        {(category as string).toLowerCase() === "shoes" && (
          <div className="sm:flex justify-center gap-2 flex-wrap mt-2 min-h-[40px] hidden">
            {[...filterSize]
              .sort((a, b) => Number(a.size) - Number(b.size)) // 🔁 Sort numerically
              .map((sizeObj, idx) => (
                <Button
                  key={idx}
                  variant={selectedSize === sizeObj.size ? "default" : "custom"}
                  size="sm"
                  className="px-3 py-1 text-xs rounded-md"
                  onClick={() => setSelectedSize(sizeObj.size)}
                >
                  {sizeObj.size}
                </Button>
              ))}
          </div>
        )}

        {/* 
        <div className="mt-auto pt-3">
          <Button className="w-full" variant="secondary">
            Add to Cart
          </Button>
        </div> */}

        {/* <Link href={`/products/${id}`}>
          <h3 className="text-xl font-medium  text-center text-gray-800 line-clamp-2  min-h-[42px]">
            Product name : {name}
          </h3>
        </Link> */}

        <Link href={`/products/${id}`}>
          <h3 className="text-md sm:text-xl  font-bold  text-center text-gray-800 line-clamp-2  ">
            Product code : {productCode}
          </h3>
        </Link>

        <p className="text-center text-lg font-semibold text-orange-400">৳{price}</p>
      </CardContent>
    </Card>
  );
}
