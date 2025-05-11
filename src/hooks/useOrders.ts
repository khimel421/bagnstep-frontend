import { useState, useEffect } from "react";
import axios from "axios";
import { Order } from "@/types/types";

const API_URL = "http://localhost:5000/api/admin/orders";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setOrders(response.data.orders);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  
  // Auto refetch every 30 minutes
  useEffect(() => {
    fetchOrders(); // Initial fetch on mount

    const interval = setInterval(() => {
      fetchOrders();
    }, 30 * 60 * 1000); // 30 minutes = 1800000 ms

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  // Create a new order
  const createOrder = async (newOrder: Partial<Order>) => {
    try {
      setLoading(true);
      const response = await axios.post<Order>(API_URL, newOrder);
      setOrders((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.message || "Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing order
  const updateOrder = async (id: string, updatedFields: Partial<Order>) => {
    try {
      setLoading(true);
      const response = await axios.put<Order>(`${API_URL}/${id}`, updatedFields);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? response.data : order))
      );
      return response.data;
    } catch (err: any) {
      setError(err.message || "Failed to update order.");
    } finally {
      setLoading(false);
    }
  };

  // Delete an order
  const deleteOrder = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete order.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on first render
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    setOrders, // exposed if you want to manually update from outside
  };
};
