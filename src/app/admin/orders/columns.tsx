"use client";

import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


import { Order } from "@/types/product";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const getOrderStatusColor = (status: Order["status"]) => {
  const colorMap = {
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancel: "bg-red-100 text-red-700",
  };
  return colorMap[status as keyof typeof colorMap] || "bg-gray-100 text-gray-700";
};

export const columns = (
  refreshOrders: () => void // pass refresh function
): ColumnDef<Order>[] => [
    {
      accessorKey: "id",
      header: "Order ID",
    },
    {
      accessorKey: "customer.name",
      header: "Customer",
      cell: ({ row }) => <span>{row.original.customer?.name || "N/A"}</span>,
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => (
        <span>৳ {parseFloat(String(row.original.totalAmount)).toFixed(2)}</span>
      ),
    },
    {
      header: "Items",
      cell: ({ row }) => {
        const items = row.original.items;

        console.log(items)

        return (
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm">
      View Items
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-96 p-4 max-h-96 overflow-y-auto">
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-4 border-b pb-3 last:border-none"
        >
          <Image
            src={item.product.images[0]}
            width={100}
            height={100}
            alt={item.product.name}
            className="w-14 h-14 object-cover rounded-md border"
          />
          <div className="flex-1 text-sm space-y-1">
            <div className="font-semibold text-base">{item.product.name}</div>
            <div className="text-xs text-muted-foreground">
              Product ID: <span className="font-mono">{item.product.id}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Size: <span className="font-medium">{item.productSize?.size ?? "Default"}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Quantity: <span className="font-medium">{item.quantity}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Price: <span className="font-medium">৳ {item.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </PopoverContent>
</Popover>



        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex items-center gap-2">
            <Badge className={getOrderStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>

            <Select
              defaultValue={order.status}
              onValueChange={async (value) => {
                try {
                  await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/status`,
                    { status: value }
                  );
                  toast.success("Order status updated");
                  refreshOrders(); // refresh data after update
                } catch (error) {
                  console.log(error)
                  toast.error("Failed to update status");
                }
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancel">Cancel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span>{format(new Date(row.original.createdAt), "PPP")}</span>
      ),
    },
  ];
