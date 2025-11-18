"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingBag, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { apiRequest } from "@/services/api";
import { useRouter } from "next/navigation";

export function CartSidebar() {
  const {
    items,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    restaurantId,
    clearCart,
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      apiRequest("/addresses/me")
        .then((data) => {
          setAddresses(data || []);
          if (data && data.length > 0)
            setSelectedAddress(data[0].id.toString());
        })
        .catch(console.error);
    }
  }, [isOpen]);

  const handleCheckout = async () => {
    if (!restaurantId || !selectedAddress) {
      alert("Selecione um endereço para entrega.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        restaurantId: restaurantId,
        deliveryAddressId: parseInt(selectedAddress),
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Pedido realizado com sucesso!");
      clearCart();
      setIsOpen(false);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartCount === 0) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-xl bg-primary hover:bg-primary/90 z-50 flex flex-col gap-1">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xs font-bold">{cartCount}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-slate-900 border-slate-800 text-white flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-white">Seu Pedido</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.product.name}</h4>
                <p className="text-xs text-slate-400">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.product.price)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-700 rounded-md p-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="p-1 hover:bg-slate-600 rounded"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="p-1 hover:bg-slate-600 rounded"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Endereço de Entrega</label>
            {addresses.length > 0 ? (
              <Select
                value={selectedAddress}
                onValueChange={setSelectedAddress}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {addresses.map((addr) => (
                    <SelectItem key={addr.id} value={addr.id.toString()}>
                      {addr.street}, {addr.number} - {addr.neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-yellow-500 bg-yellow-900/20 p-2 rounded">
                Você não tem endereços cadastrados. Vá em Perfil para adicionar.
              </div>
            )}
          </div>

          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(cartTotal)}
            </span>
          </div>

          <SheetFooter>
            <Button
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold"
              onClick={handleCheckout}
              disabled={isSubmitting || addresses.length === 0}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Enviando..." : "Confirmar Pedido"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
