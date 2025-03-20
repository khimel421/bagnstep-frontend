"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditProductForm({ product, refresh }: { product: any; refresh: () => void }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify({ name, price }),
      headers: { "Content-Type": "application/json" },
    });
    refresh();
  };

  return (
    <form onSubmit={handleUpdate} className="flex gap-4 mb-4">
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <Button type="submit">Update</Button>
    </form>
  );
}
