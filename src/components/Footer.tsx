import Link from "next/link";
import { Facebook, Instagram, Locate, Phone, Store, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function Footer() {

  const phone = "8801836282169";
  const message = encodeURIComponent("Hi, I'm interested in your shoes!");
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

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
            <div className="flex gap-2 mt-2">
              <Link href={"https://www.facebook.com/profile.php?id=100094382247247"} target="_blank" rel="noopener noreferrer">
                <Button variant={'facebook'} className="w-full text-white">
                  Facebook <FaFacebook />
                </Button>
              </Link>
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant={'whatsapp'} className="w-full text-white">
                  WhatsApp <FaWhatsapp />
                </Button>
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
              {/* <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li> */}
              <li><Link href="/products" className="text-gray-400 hover:text-white">Shop</Link></li>
              {/* <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li> */}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 "> <Phone /> CALL US </h3>
            <p className="ml-2">+880 1836-282169</p>
          </div>



          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 "> <Store />  Shop  </h3>
            <p className="ml-2">House No:12/12, Road No:02, Nobinogor Housing Mohammadpur Dhaka 1207, Dhaka, Bangladesh</p>
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
