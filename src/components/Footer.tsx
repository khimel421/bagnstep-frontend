import Link from "next/link";
import { Facebook, Instagram, Phone, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10  w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Company Info */}
          <div>
            <h2 className="text-lg font-bold mb-4">BAGNSTEP</h2>
            <p className="text-gray-400">
              Premium quality shoes and fashion accessories for the modern lifestyle.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="https://facebook.com" target="_blank">
                <Facebook className="text-gray-400 hover:text-white" size={24} />
              </Link>
              <Link href="https://instagram.com" target="_blank">
                <Instagram className="text-gray-400 hover:text-white" size={24} />
              </Link>
              <Link href="https://twitter.com" target="_blank">
                <Twitter className="text-gray-400 hover:text-white" size={24} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/shop" className="text-gray-400 hover:text-white">Shop</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 "> <Phone /> CALL US </h3>
          <p className="ml-2">01793558264</p>
          </div>
        </div>

        

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} BAGNSTEP. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
