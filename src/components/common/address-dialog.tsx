"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2, Plus } from "lucide-react";
import { AddressFormWithMap } from "./address-form-with-map";

interface AddressDialogProps {
  onAddressSaved: () => void;
  initialAddress?: any;
}

export function AddressDialog({
  onAddressSaved,
  initialAddress,
}: AddressDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    onAddressSaved();
  };

  const isEditing = !!initialAddress;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:bg-primary/10"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Endereço
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-2xl bg-background border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? `Editar Endereço` : "Cadastrar Novo Endereço"}
          </DialogTitle>
        </DialogHeader>

        <AddressFormWithMap
          onSuccess={handleSuccess}
          initialAddress={initialAddress}
        />
      </DialogContent>
    </Dialog>
  );
}
