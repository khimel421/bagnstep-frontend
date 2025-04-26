"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { X } from "lucide-react";
import { Image } from "antd";
import { Product } from "@/types/product";


export default function EditProductForm() {
    const { slug } = useParams(); // ✅ Fetch product ID from URL params
    const [product, setProduct] = useState<Product | null>(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [sizes, setSizes] = useState<{ size: string; stock: number }[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [removedImages, setRemovedImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    // ✅ Fetch product details when component mounts
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admin/products/${slug}`);
                const productData = response.data;
                setProduct(productData);
                setName(productData.name);
                setPrice(productData.price.toString());
                setSizes(productData.sizes || []);
                setExistingImages(productData.images || []);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug]);

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

        try {
            await axios.put(`http://localhost:5000/api/admin/products/${slug}`, {
                name,
                price: parseFloat(price),
                images: updatedImages,
                removedImages,
                sizes,
            });

            alert("Product updated successfully!");
            window.location.reload(); // Refresh page after update
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    if (!product) {
        return <p>Loading product details...</p>;
    }

    return (
        <>
            <h1 className="text-center font-bold text-4xl my-8">Update Product</h1>


            <form onSubmit={handleUpdate} className="flex flex-col gap-4 mb-4 pb-20">
                {/* ✅ Existing Images Preview with Remove Option */}
                <label className="text-lg font-semibold" htmlFor="">Images : </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">

                    {existingImages.map((img, index) => (
                        <div key={index} className="relative border-2 border-black p-2 rounded-lg">
                            <Image src={img} alt="Product" className=" lg:w-[200px]  rounded object-cover" />
                            <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs rounded"
                                onClick={() => handleRemoveExistingImage(img)}
                            >
                                <X />
                            </button>
                        </div>
                    ))}
                </div>
                <label className="text-lg font-semibold" htmlFor="">Name : </label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" />
                <label className="text-lg font-semibold" htmlFor="">Price : </label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />


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
                    <label className="text-lg font-semibold" htmlFor=""> </label>

                    {sizes.map((size, index) => (
                        <div key={index} className="flex gap-2 mt-2">
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
                    <Button className="mt-4" type="button" onClick={addSize}>Add Size</Button>
                </div>

                <Button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Update Product"}</Button>
            </form>
        </>

    );
}
