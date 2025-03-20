"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import ImageUploader from "./ImageUploader";
import axios from "axios";

export default function AddProductForm({ refresh }: { refresh: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState(""); // Comma-separated string for sizes
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);
  


  // ✅ Upload images to Cloudinary
  const handleImageUpload = async () => {
    if (selectedImages.length === 0) return [];

    setUploading(true);
    const uploadedImageUrls = [];

    for (const image of selectedImages) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "productImages"); // Change this
      formData.append("folder", "uploads"); // Optional

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
    return uploadedImageUrls; // Return array of image URLs
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const imageUrls = await handleImageUpload(); // Upload images before submitting

    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      sizes: JSON.stringify(sizes.split(",")), // Convert to JSON array
      images: JSON.stringify(imageUrls), // Store image URLs as JSON array
    };

    await fetch("http://localhost:5000/api/admin/products", {
      method: "POST",
      body: JSON.stringify(productData),
      headers: { "Content-Type": "application/json" },
    });

    refresh();
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategory("");
    setSizes("");
    setSelectedImages([]); // Clear images
    setResetTrigger(true);

    // Reset the trigger after a short delay
    setTimeout(() => setResetTrigger(false), 100);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-lg bg-white shadow">
      <Input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <Input placeholder="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
      <Input placeholder="Sizes (e.g., S, M, L, XL)" value={sizes} onChange={(e) => setSizes(e.target.value)} required />

      {/* ✅ Select Category */}
      <Select onValueChange={setCategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Shoes">Shoes</SelectItem>
          <SelectItem value="Bags">Bags</SelectItem>
          <SelectItem value="Accessories">Accessories</SelectItem>
        </SelectContent>
      </Select>

      {/* ✅ Image Upload (Pass images to parent) */}
      <ImageUploader onImagesSelected={setSelectedImages} resetTrigger={resetTrigger} />

      <Button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Add Product"}
      </Button>
    </form>
  );
}
