"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronLeft, Plus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CartSidebar } from "@/components/client/cart-sidebar";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
}

interface RestaurantDetails {
  id: string;
  name: string;
  categoryName?: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  items?: Product[];
}

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const id = params.id;
        const resData = await apiRequest(`/restaurants/${id}`);
        setRestaurant(resData);

        const prodData = await apiRequest(`/restaurants/${id}/products`);
        setProducts(prodData);
      } catch (error) {
        console.error("Erro ao carregar restaurante", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchDetails();
  }, [params.id]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  if (!restaurant)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Restaurante não encontrado
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Banner / Header */}
      <div className="relative h-48 md:h-64 bg-card">
        <img
          src={`https://picsum.photos/1200/400?${
            restaurant.categoryName || "food"
          }`}
          className="w-full h-full object-cover opacity-60"
          alt="Capa"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 rounded-full"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-200">
              <span className="text-primary font-semibold">
                {restaurant.categoryName || "Geral"}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{restaurant.rating || "4.5"}</span>
              </div>
              <span>•</span>
              <span>{restaurant.deliveryTime || "30-45 min"}</span>
              <span>•</span>
              <span>
                {restaurant.deliveryFee === 0
                  ? "Entrega Grátis"
                  : `R$ ${restaurant.deliveryFee?.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo / Cardápio */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Cardápio</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-card border-slate-700 hover:bg-slate-800/60 transition-colors flex overflow-hidden"
            >
              {product.imageUrl && (
                <div className="w-32 h-full bg-slate-700">
                  <img
                    src={product.imageUrl}
                    className="w-full h-full object-cover"
                    alt={product.name}
                  />
                </div>
              )}

              <CardContent className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base text-white">
                      {product.name}
                    </h3>
                    <span className="text-primary font-bold whitespace-nowrap">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    size="sm"
                    className="bg-slate-700 hover:bg-primary text-white"
                    onClick={() => {
                      if (!restaurant) return;
                      addToCart(product, restaurant.id);
                      alert(`Adicionado: ${product.name}`);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CartSidebar />
    </div>
  );
}
