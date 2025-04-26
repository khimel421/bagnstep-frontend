"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, Package, ShoppingCart, Users,  PlusCircle 
} from "lucide-react";

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Products", href: "/admin/manageProduct", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  // { name: "Reports", href: "/admin/reports", icon: BarChart },
  // { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminBottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="z-10 fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 shadow-md">
      <div className="flex justify-around items-center py-2 relative">
        {adminLinks.map(({ name, href, icon: Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1">
            <Icon className={cn("w-5 h-5", pathname === href ? "text-white" : "text-gray-400")} />
            <span className={cn("text-xs", pathname === href ? "text-white font-medium" : "text-gray-400")}>
              {name}
            </span>
          </Link>
        ))}

        {/* Add Product Button - Centered */}
        <Link
          href="/admin/addProduct"
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#FF6B00] hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all flex items-center justify-center"
        >
          <PlusCircle className="w-7 h-7" />
        </Link>
      </div>
    </nav>
  );
}
