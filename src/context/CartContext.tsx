"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast, Toaster } from "sonner";

interface CartItem {
  id: number;
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
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
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

  // Persistence
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    storedCart && setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => 
        i.id === item.id && i.size === item.size
      );
      
      return existing
        ? prev.map(i =>
            i.id === item.id && i.size === item.size
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...prev, item];
    });

    toast("Product added to cart")


    // ✅ Dispatch a custom event to open the cart
    document.dispatchEvent(new Event("cartUpdated"));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart(prev =>
      prev.map(item =>
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
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};