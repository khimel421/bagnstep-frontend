'use client';

import React, { useEffect, useState, use } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Order } from '@/types/types';
import Image from 'next/image';

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading order details...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!order) return <div className="text-center">Order not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto my-10 bg-white shadow rounded-xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Order #{order.id}</h1>

      {/* Customer Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><span className="font-medium">Name:</span> {order.customer?.name || 'N/A'}</p>
          <p><span className="font-medium">Phone:</span> {order.customer?.phone || 'N/A'}</p>
          <p><span className="font-medium">Address:</span> {order.customer?.address || 'N/A'}</p>
        </div>
      </div>

      {/* Ordered Items */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Ordered Items</h2>
        <div className="space-y-4">
          {order.items?.length > 0 ? (
            order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-center border p-4 rounded-md bg-gray-50 shadow-sm"
              >
                <Image
                  src={item.product.images?.[0]}
                  alt="product image"
                  width={80}
                  height={80}
                  className="rounded object-cover border"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.product.productCode}</p>
                  <p><span className="text-sm font-medium text-gray-600">Size:</span> {item.productSize?.size || 'N/A'}</p>
                  <p><span className="text-sm font-medium text-gray-600">Qty:</span> {item.quantity}</p>
                  <p><span className="text-sm font-medium text-gray-600">Price:</span> ৳{Number(item.price).toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items found for this order.</p>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <span className="font-medium">Status:</span>{' '}
            <span
              className={`inline-block px-2 py-1 rounded text-white text-sm ${
                order.status === 'pending'
                  ? 'bg-yellow-500'
                  : order.status === 'completed'
                  ? 'bg-green-600'
                  : 'bg-gray-500'
              }`}
            >
              {order.status}
            </span>
          </p>
          <p><span className="font-medium">Total:</span> ৳{Number(order.totalAmount).toFixed(2)}</p>
          <p><span className="font-medium">Note:</span> {order.note || 'N/A'}</p>
          <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
