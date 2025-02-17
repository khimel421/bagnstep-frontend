'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ProductImageSlider from '@/components/ProductImageSlider';

interface Product {
    id: number;
    product_code: string;
    product_name: string;
    price: number;
    sizes: string[];
    image: string;
    description: string;
    origin: string;
    color: string;
    upper_material: string;
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch('/products.json'); // Fetching from public folder
                const data: Product[] = await response.json();
                const foundProduct = data.find((p) => p.id === Number(id));
                setProduct(foundProduct || null);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!product) return <p className="text-center mt-10">Product not found</p>;

    return (
        <div className="flex justify-center items-center min-h-screen p-6 bg-gray-50">
            <Card className="w-full max-w-xl p-6 shadow-lg rounded-2xl bg-white">
                {/* <Image
                    src={product.image}
                    alt={product.product_name}
                    width={400}
                    height={300}
                    className="rounded-lg w-full object-cover"
                /> */}
                <ProductImageSlider
                    product={{
                        product_name: product.product_name,
                        images: [
                            'https://walkerlifestyle.com/wp-content/uploads/2025/01/581-6-scaled-700x700.jpg',
                            'https://walkerlifestyle.com/wp-content/uploads/2025/01/580-2-scaled-700x700.jpg',
                            'https://walkerlifestyle.com/wp-content/uploads/2025/01/1-1-scaled-700x700.jpg',
                            'https://walkerlifestyle.com/wp-content/uploads/2025/01/578-3-scaled-700x700.jpg',
                        ],
                    }}
                />

                <CardContent className="p-4">
                    <h1 className="text-2xl font-bold mb-2">{product.product_name}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-lg font-bold">${product.price}</p>

                    {/* Additional Details */}
                    <div className="mt-3 space-y-1 text-sm text-gray-700">
                        <p><span className="font-semibold">Origin:</span> {product.origin}</p>
                        <p><span className="font-semibold">Color:</span> {product.color}</p>
                        <p><span className="font-semibold">Material:</span> {product.upper_material}</p>
                    </div>

                    {/* Sizes Selection */}
                    <div className="mt-4">
                        <p className="font-semibold">Select Size:</p>
                        <div className="flex gap-2 mt-2">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`px-3 py-1 border rounded-md text-sm transition-all duration-200 ${selectedSize === size
                                            ? 'bg-black text-white border-black'
                                            : 'hover:bg-gray-200'
                                        }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button className="w-full mt-6 flex items-center gap-2">
                        <ShoppingCart size={16} /> Add to Cart
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
