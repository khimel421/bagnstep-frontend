'use client';
import { Home, ShoppingCart, User, Search, Store } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t border-gray-200 p-2 flex justify-around items-center md:hidden">
      <NavItem href="/" icon={<Store size={24} />} label="Shop" />
      {/* Shopping Cart with Sheet */}
      <div className="flex flex-col items-center text-gray-600 hover:text-black">
        <Sheet>
          <SheetTrigger className="flex flex-col items-center">
            <ShoppingCart size={24} />
            <span className="text-xs">Cart</span>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Your Shopping Cart</SheetTitle>
            </SheetHeader>
            <div className="p-4 text-gray-700">Your cart is empty.</div>
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
