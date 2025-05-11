"use client"
import SimpleTable from "@/components/NewOrderTable";
import { useOrders } from "@/hooks/useOrders";
import { Order } from "@/types/types";
import React, { useEffect, useState } from "react";
 // Import the SimpleTable component


const OrdersPage: React.FC = () => {
  // Sample orders data
  const { orders, fetchOrders  } = useOrders();


  // Fetch orders from an API on component mount
  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       // Replace this with your actual API URL
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
        
  //       // Check if the response is OK
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch orders");
  //       }

  //       const data = await response.json();
  //       setOrders(data.orders); // Set orders state with the fetched data
  //     } catch (error: any) {
  //       setError(error.message); // Set error state if there's an error
  //     } finally {
  //       setLoading(false); // Set loading to false once the request is completed
  //     }
  //   };

  //   fetchOrders();
  // }, []);

  console.log(orders)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Order List</h1>
      <SimpleTable  />
    </div>
  );
};

export default OrdersPage;
