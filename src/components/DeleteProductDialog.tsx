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
import { Archive, Loader2 } from "lucide-react";
import axios from "axios";

export interface ArchiveProductDialogProps {
  productId: string;
  productName: string;
  /** optional callback fired after successful archive */
  onArchived?: () => void;
}

/**
 * Archive‑product dialog for admin tables.
 *
 * Usage:
 *   <ArchiveProductDialog
 *       productId={item.id}
 *       productName={item.name}
 *       onArchived={refreshProducts}
 *   />
 */
export default function ArchiveProductDialog({
  productId,
  productName,
  onArchived,
}: ArchiveProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const handleArchive = async () => {
    if (archiving) return;
    setArchiving(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/archive`
      );
      onArchived?.();      // refresh list in parent
      setOpen(false);
    } catch (err) {
      console.error("Error archiving product", err);
    } finally {
      setArchiving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Archive product"
          aria-label="Archive product"
        >
          <Archive className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90%] rounded-xl">
        <DialogHeader>
          <DialogTitle>Archive product</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive <strong>{productName}</strong>? You
            can restore it later from the “Archived” tab. Order history will
            remain intact.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={archiving}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleArchive}
            disabled={archiving}
          >
            {archiving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Archiving…
              </>
            ) : (
              "Archive"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
