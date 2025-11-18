"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/services/api";
import { ProductDialog } from "./product-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit2, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  active: boolean;
}

interface RestaurantMenuProps {
  restaurantId: string;
}

export function RestaurantMenu({ restaurantId }: RestaurantMenuProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await apiRequest(`/restaurants/${restaurantId}/products`);
      setProducts(data || []);
    } catch (error) {
      console.error("Erro ao buscar cardápio", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [restaurantId]);

  const handleDelete = async (productId: number) => {
    const promise = apiRequest(`products/${productId}`, { method: "DELETE" });

    toast.promise(promise, {
      loading: "Removendo item do cardápio...",
      success: (data) => {
        setProducts(products.filter((p) => p.id !== productId));
        return "Produto removido com sucesso!";
      },
      error: "Erro ao deletar produto. Tente novamente.",
      duration: 3000,
    });
  };

  if (isLoading)
    return <div className="p-8 text-center">Carregando cardápio...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Meu Cardápio</h2>
          <p className="text-slate-400">
            Gerencie os produtos disponíveis para venda
          </p>
        </div>
        <ProductDialog restaurantId={restaurantId} onSuccess={fetchProducts} />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-dashed border-slate-900">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            Seu cardápio está vazio
          </h3>
          <p className="text-slate-400 mb-6">
            Cadastre seu primeiro prato para começar a vender.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-card border-slate-900 overflow-hidden hover:border-slate-800 transition-all"
            >
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-foreground truncate pr-2">
                      {product.name}
                    </h3>
                    <span className="font-mono text-foreground font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.price)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2 h-10 mb-4">
                    {product.description}
                  </p>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-700/50">
                    {/* Botão Editar (placeholder visual, lógica futura) */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
