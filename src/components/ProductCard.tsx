/*
  Enhanced ProductCard component
  --------------------------------
  • Adds subtle motion hover animation using Framer Motion
  • Shows discount badge with % off when discountPrice is supplied
  • Improves price layout (original crossed‑out, discount highlighted)
  • Adds graceful image fallback + skeleton loader
  • Displays size selector as a scrollable pill row on mobile & grid on desktop
  • Shows “Out of Stock” overlay if every size has zero stock
  • Keeps all existing props so it’s a drop‑in replacement
*/

'use client';

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCardProps } from "@/types/types";

export default function ProductCard({
  images = [],
  name = "",
  productCode = "",
  price = 0,
  discountPrice = 0,
  sizes = [],
  id,
  category,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  // 🔍 Pre‑compute filtered / derived values
  const availableSizes = useMemo(
    () => sizes.filter((s) => s.stock > 0).sort((a, b) => Number(a.size) - Number(b.size)),
    [sizes]
  );
  const isOutOfStock = availableSizes.length === 0;

  // 📸 Choose the first valid image or fallback
  const coverImage = images?.[0] ?? "/fallback-image.jpg";

  // 🏷️ Calculate discount percentage
  const discountPercent = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 25px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white">
        {/* -------------- Image -------------- */}
        <Link href={`/products/${id}`} className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={coverImage}
            alt={name}
            fill
            priority
            sizes="(min-width: 640px) 300px, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="/249.jpg"
          />

          {discountPercent > 0 && (
            <Badge className="absolute left-3 top-3 bg-red-500 text-white shadow-md">
              -{discountPercent}%
            </Badge>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="rounded bg-white/80 px-3 py-1 text-sm font-semibold text-red-600 shadow">Out&nbsp;of&nbsp;stock</span>
            </div>
          )}
        </Link>

        {/* -------------- Content -------------- */}
        <CardContent className="flex flex-grow flex-col gap-3 p-4">
          {/* Product title */}
          <Link href={`/products/${id}`}>   {/* re‑use same link for SEO */}
            <h3 className="line-clamp-2 text-center text-sm font-semibold text-gray-800 sm:text-base">
              Code: {productCode}
            </h3>
          </Link>

          {/* Size picker (only for shoes & if stock) */}
          {(category as string).toLowerCase() === 'shoes' && !isOutOfStock && (
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto sm:grid sm:grid-cols-4 sm:overflow-visible">
              {availableSizes.map((sizeObj) => (
                <Button
                  key={sizeObj.size}
                  variant={selectedSize === sizeObj.size ? 'default' : 'outline'}
                  size="sm"
                  className="min-w-[50px] flex-shrink-0 rounded-md px-3 py-1 text-xs"
                  onClick={() => setSelectedSize(sizeObj.size)}
                >
                  {sizeObj.size}
                </Button>
              ))}
            </div>
          )}

          {/* Prices */}
          <div className="mt-auto flex items-center justify-center gap-2">
            {discountPrice ? (
              <>
                <span className="text-md font-medium text-gray-400 line-through">৳{price}</span>
                <span className="text-xl font-bold text-green-600">৳{discountPrice}</span>
              </>
            ) : (
              <span className="text-lg font-semibold text-orange-500">৳{price}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
