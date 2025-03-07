"use client";

import { Store, ShoppingCart } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function BottomNavbar() {
  const [open, setOpen] = useState(false);
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const closeMenu = () => setOpen(false);

  // Calculate total cart items
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t border-gray-200 p-2 flex justify-around items-center md:hidden">
      <NavItem href="/" icon={<Store size={24} />} label="Shop" />

      {/* Shopping Cart with Sheet (Cart Drawer) */}
      <div className="relative flex flex-col items-center text-gray-600 hover:text-black ">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex flex-col items-center">
            <ShoppingCart size={24} />
            <span className="text-xs">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {cartItemCount}
              </span>
            )}
          </SheetTrigger>

          {/* Sheet Content */}
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Your Shopping Cart</SheetTitle>
            </SheetHeader>

            {/* Cart Items */}
            <div className="p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col gap-4 justify-center items-center">
                  <p className="text-gray-500 text-center">Your cart is empty.</p>
                  <Link href={`/products`}> <Button onClick={closeMenu}>RETURN TO SHOP</Button></Link>
                </div>

              ) : (
                <>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 border-b pb-3">
                        <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md" />
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold">{item.name}</h3>
                          <p className="text-gray-600 text-xs">${item.price} x {item.quantity}</p>
                          {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1}>
                            -
                          </Button>
                          <span className="text-sm">{item.quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="border-t pt-4 absolute bottom-10 w-[80%]">
                    <p className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</p>
                    <div className="mt-3 flex flex-col gap-3">
                      <Link href={'/cart'}>
                        <Button onClick={closeMenu}  className="w-full">
                          <ShoppingCart size={24} />
                          VIEW CART
                        </Button></Link>
                      <Link href="/checkout">
                        <Button className="w-full text-white">
                          CHECKOUT
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center text-gray-600 hover:text-black">
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}
