"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";

export default function EditProductForm({
  product,
  refresh,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    sizes: { size: string; stock: number }[];
  };
  refresh: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [sizes, setSizes] = useState(product.sizes || []);
  const [existingImages, setExistingImages] = useState<string[]>(product.images || []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // ✅ Handle Image Upload
  const handleImageUpload = async () => {
    if (newImages.length === 0) return [];

    setUploading(true);
    const uploadedImageUrls: string[] = [];

    for (const image of newImages) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "productImages");
      formData.append("folder", "uploads");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/da4l4bhhn/image/upload",
          formData
        );
        uploadedImageUrls.push(response.data.secure_url);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setUploading(false);
    return uploadedImageUrls;
  };

  // ✅ Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)]);
    }
  };

  // ✅ Remove existing image
  const handleRemoveExistingImage = (url: string) => {
    setExistingImages(existingImages.filter((img) => img !== url));
    setRemovedImages([...removedImages, url]);
  };

  // ✅ Remove newly selected image
  const handleRemoveNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // ✅ Update size details
  const updateSize = (index: number, field: string, value: string | number) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setSizes(updatedSizes);
  };

  const addSize = () => setSizes([...sizes, { size: "", stock: 0 }]);

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // ✅ Submit form with uploaded images & removed images
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrls = await handleImageUpload();
    const updatedImages = [...existingImages, ...imageUrls];

    await fetch(`${process.env.NEXT_PRIVATE_API_URL}/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        images: updatedImages,
        removedImages,
        sizes,
      }),
      headers: { "Content-Type": "application/json" },
    });

    refresh();
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-4 mb-4">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" />
      <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />

      {/* ✅ Existing Images Preview with Remove Option */}
      <div className="flex gap-2 flex-wrap">
        {existingImages.map((img, index) => (
          <div key={index} className="relative">
            <Image src={img} alt="Product" className="w-16 h-16 rounded" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs rounded"
              onClick={() => handleRemoveExistingImage(img)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Upload New Images */}
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      <div className="flex gap-2 flex-wrap">
        {newImages.map((file, index) => (
          <div key={index} className="relative">
            <Image src={URL.createObjectURL(file)} alt="New Product" className="w-16 h-16 rounded" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs rounded"
              onClick={() => handleRemoveNewImage(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Sizes Management */}
      <div>
        <h3>Sizes</h3>
        {sizes.map((size, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={size.size}
              onChange={(e) => updateSize(index, "size", e.target.value)}
              placeholder="Size (e.g., US 9)"
            />
            <Input
              type="number"
              value={size.stock}
              onChange={(e) => updateSize(index, "stock", Number(e.target.value))}
              placeholder="Stock"
            />
            <Button type="button" onClick={() => removeSize(index)}>Remove</Button>
          </div>
        ))}
        <Button type="button" onClick={addSize}>Add Size</Button>
      </div>

      <Button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Update Product"}</Button>
    </form>
  );
}
