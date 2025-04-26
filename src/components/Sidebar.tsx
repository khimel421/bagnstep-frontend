import { LayoutDashboard, Package, ShoppingCart, Users, BarChart,  Plus, Bell } from "lucide-react";
import Link from "next/link";

const sidebarItems = [
  { name: "Dashboard", icon: <LayoutDashboard />, href: "/admin" },
  { name: "Products", icon: <Package />, href: "/admin/manageProduct" },
  { name: "Add product", icon: <Plus />, href: "/admin/addProduct" },
  { name: "Orders", icon: <ShoppingCart />, href: "/admin/orders" },
  { name: "Customers", icon: <Users />, href: "/admin/customers" },
  { name: "Reports", icon: <BarChart />, href: "/admin/reports" },
  { name: "Notification", icon: <Bell />, href: "/admin/settings" },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4 fixed">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link href={item.href} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
