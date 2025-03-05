"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash, Minus, Plus } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    // Calculate total price
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h2>

            {cart.length === 0 ? (
                <div className="flex flex-col gap-4 justify-center items-center">
                    <p className="text-gray-500 text-center">Your cart is empty.</p>
                    <Link href={`/products`}> <Button>RETURN TO SHOP</Button></Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Cart Items List */}
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border p-4 rounded-lg">
                            <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md" />

                            <div className="flex-1 ml-4">
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <p className="text-gray-600">${item.price}</p>
                                {item.size && <p className="text-gray-500">Size: {item.size}</p>}
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center">
                                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1}>
                                    <Minus size={16} />
                                </Button>
                                <span className="mx-3">{item.quantity}</span>
                                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                    <Plus size={16} />
                                </Button>
                            </div>

                            {/* Remove Button */}
                            <Button variant="destructive" size="icon" onClick={() => removeFromCart(item.id)}>
                                <Trash size={16} />
                            </Button>
                        </div>
                    ))}

                    {/* Cart Summary */}
                    <div className="border-t pt-6 flex flex-col gap-4">
                        <p className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</p>

                        <Button onClick={clearCart} variant="destructive">
                            Clear Cart
                        </Button>

                        <Link href="/checkout">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Proceed to Checkout
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
