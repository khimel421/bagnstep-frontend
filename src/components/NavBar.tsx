'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="bg-white shadow-md flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href={'/'}><Image src={'/images/logo.png'} width={100} height={0} alt='logo' /></Link>
          

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-bold">HOME</Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-bold">ALL PRODUCTS</Link>
            <Link href="/services" className="text-gray-700 hover:text-gray-900 font-bold">PREMIUM QUALITY</Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-bold">DISCOUNT</Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-bold">SIZE CHART</Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger>
                <Menu size={24} className="text-gray-700" />
              </SheetTrigger>
              <SheetContent side={'left'}>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 p-4">
                  <Link href="/" className="text-gray-700 hover:text-gray-900 font-bold" onClick={closeMenu}>HOME</Link>
                  <Link href="/about" className="text-gray-700 hover:text-gray-900 font-bold" onClick={closeMenu}>ALL PRODUCTS</Link>
                  <Link href="/services" className="text-gray-700 hover:text-gray-900 font-bold" onClick={closeMenu}>PREMIUM QUALITY</Link>
                  <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-bold" onClick={closeMenu}>DISCOUNT</Link>
                  <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-bold" onClick={closeMenu}>SIZE CHART</Link>
                </div>
              </SheetContent>
            </Sheet>

            {/* Shopping cart Icon */}
            <Sheet>
              <SheetTrigger><ShoppingCart size={24} /></SheetTrigger>
              <SheetContent  side={'right'}>
                <SheetHeader>
                  <SheetTitle>Are you absolutely sure?</SheetTitle>
                </SheetHeader>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </div>
    </nav>
  );
}
