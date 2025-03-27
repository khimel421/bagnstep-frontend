"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface CartItem {
  id: string; // ✅ Ensuring id is a string to match Prisma schema (UUID)
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const prevCartLength = useRef(0);
  const initialLoad = useRef(true);

  // Cart length change detection
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      prevCartLength.current = cart.length;
      return;
    }

    if (cart.length > prevCartLength.current) {
      setCartOpen(true);
    }
    prevCartLength.current = cart.length;
  }, [cart]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    if (item.quantity < 1) return;

    setCart((prev) => {
      const existingItem = prev.find(
        (i) => i.id === item.id && i.size === item.size
      );

      return existingItem
        ? prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity, price: Number(item.price) }
            : i
        )
        : [...prev, { ...item, price: Number(item.price) }];
    });

    toast.success("Product added to cart");
    document.dispatchEvent(new Event("cartUpdated"));
  };


  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCartOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
