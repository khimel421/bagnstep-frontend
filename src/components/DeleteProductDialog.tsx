"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import axios from "axios";

/**
 * Props
 */
export interface DeleteProductDialogProps {
  productId: string;
  productName: string;
  /** optional callback fired after successful deletion */
  onDeleted?: () => void;
}

/**
 * Confirm‑delete dialog reused in product tables.
 *
 * Usage:
 *   <DeleteProductDialog productId={item.id} productName={item.name} onDeleted={fetchProducts} />
 */
export default function DeleteProductDialog({
  productId,
  productName,
  onDeleted,
}: DeleteProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
      onDeleted?.(); // refresh list in parent
      setOpen(false);
    } catch (err) {
      console.error("Error deleting product", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90%] rounded-xl">
        <DialogHeader>
          <DialogTitle>Delete product</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete <strong>{productName}</strong>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
