"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddProductForm from "@/components/AddProductForm";
import EditProductForm from "@/components/EditProductForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/admin/products`);
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id: number) => {
    await fetch(`${API_URL}/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  products.map((product: { images: string }) => {
    const imagesArray: string[] = JSON.parse(product.images); // Convert JSON string to array
    console.log(imagesArray);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setEditingProduct(null)} className="mb-4">
          <PlusCircle className="mr-2" size={20} /> Add Product
        </Button>

        {editingProduct === null && <AddProductForm refresh={fetchProducts} />}
        {editingProduct && (
          <EditProductForm product={editingProduct} refresh={fetchProducts} />
        )}

        <table className="w-full mt-4 border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id} className="border">
                <td className="p-2 border">
                  {product.images ? (
                    (() => {
                      try {
                        const imagesArray: string[] = JSON.parse(product.images);
                        return imagesArray.length > 0 ? (
                          <img
                            src={imagesArray[0]} // Display the first image
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <span>No Image</span>
                        );
                      } catch (error) {
                        console.error("Error parsing images:", product.images);
                        return <span>Invalid Image Data</span>;
                      }
                    })()
                  ) : (
                    <span>No Image</span>
                  )}
                </td>


                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">${product.price}</td>
                <td className="p-2 border">{product.stock}</td>
                <td className="p-2 border flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
