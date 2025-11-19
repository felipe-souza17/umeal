"use client";

import { useState, useEffect } from "react";
import { Loader2, Search } from "lucide-react";
import { Restaurant, RestaurantCard } from "./restaurant-card";
import { Skeleton } from "../ui/skeleton";
import { apiRequest } from "@/services/api";

import { useCategories } from "@/hooks/use-categories";

export function ClientHome({ userName }: { userName: string }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { categories, isLoading: isLoadingCategories } = useCategories();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await apiRequest("/restaurants");
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (error) {
        console.error("Erro ao buscar restaurantes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    let result = restaurants;

    if (searchQuery) {
      result = result.filter((r) =>
        r.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeCategory) {
      result = result.filter((r) =>
        r.categories.some((c) => c.name === activeCategory)
      );
    }

    setFilteredRestaurants(result);
  }, [searchQuery, activeCategory, restaurants]);

  return (
    <div className="bg-background">
      {/* <PromoBanner /> */}
      <div className="mx-auto max-w-7xl space-y-2">
        <h2 className="text-3xl font-bold text-foreground transition-colors">
          Fome de que hoje, {userName}?
        </h2>
        <p className="text-slate-400">
          Encontre os melhores restaurantes perto de você.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Pesquise por restaurantes ou pratos"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 pl-12 text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-medium transition-colors ${
                activeCategory === null
                  ? "bg-primary text-foreground-foreground"
                  : "bg-card text-foreground border border-border hover:border-primary"
              }`}
            >
              Todos
            </button>
            {isLoadingCategories ? (
              <span className="text-sm text-muted-foreground p-2">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </span>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.name)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === category.name
                      ? "bg-primary text-white"
                      : "bg-card text-foreground border border-border hover:border-primary"
                  }`}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {activeCategory
              ? `${activeCategory} restaurantes`
              : "Restaurantes recomendados"}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-40 w-full rounded-xl bg-slate-800" />
                  <Skeleton className="h-4 w-2/3 bg-slate-800" />
                  <Skeleton className="h-4 w-1/2 bg-slate-800" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-slate-500">
                  Nenhum restaurante encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
