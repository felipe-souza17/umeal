"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/services/api";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useCategories } from "@/hooks/use-categories";

interface ProductDialogProps {
  restaurantId: string;
  onSuccess: () => void;
}

export function ProductDialog({ restaurantId, onSuccess }: ProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const { categories, isLoading: isLoadingCategories } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedPrice = parseFloat(price.replace(",", "."));

      await apiRequest(`/restaurants/${restaurantId}/products`, {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          price: formattedPrice,
          categoryId: parseInt(categoryId),
          imageUrl: "",
        }),
      });

      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao criar produto", error);
      toast.error("Erro ao criar produto. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-slate-900 text-foreground sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar ao Cardápio</DialogTitle>
          <DialogDescription className="text-slate-400">
            Crie um novo prato ou bebida para seus clientes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Prato</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: X-Bacon Supremo"
              className="bg-slate-900/50 border-slate-600"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Descrição</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ingredientes, tamanho, detalhes..."
              className="bg-slate-900/50 border-slate-600 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0,00"
                className="bg-slate-900/50 border-slate-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select onValueChange={setCategoryId} required>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue
                    placeholder={isLoadingCategories ? "Carregando..." : "Tipo"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-foreground"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Produto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
