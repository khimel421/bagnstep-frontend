import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Order, OrderItem } from "@/types/types";
import { useRouter } from "next/navigation";

function ViewItemsButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      onClick={() => router.push(`/admin/customers/${id}`)}
    >
      View Items
    </Button>
  );
}

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Customer Name",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    header: "Last Order Date",
    cell: ({ row }) => {
      const orders = row.original.orders;
      if (!orders || orders.length === 0) return "No Orders";

      // Sort orders by createdAt and get latest
      const latest = orders
        .map((o: Order) => new Date(o.createdAt))
        .sort((a: Date, b: Date) => b.getTime() - a.getTime())[0];
      return format(latest, "PPPp"); // example: Apr 12, 2025 at 6:00 PM
    },
  },
  {
    header: "Order History",
    cell: ({ row }) => {
      const orders = row.original.orders;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <ViewItemsButton id={row.original.id}></ViewItemsButton>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4 max-h-96 overflow-y-auto space-y-4">
            {orders.map((order: Order) => (
              <div key={order.id} className="border-b pb-2 last:border-none">
                <p className="text-sm font-semibold">Order ID: {order.id}</p>
                {order.items.map((item: OrderItem) => (
                  <div key={item.id} className="text-xs pl-4">
                    <p>Product: {item.product.name}</p>
                    <p>Size: {item.productSize?.size ?? "None"}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ৳ {item.price}</p>
                  </div>
                ))}
              </div>
            ))}
          </PopoverContent>
        </Popover>
      );
    },
  },
];
