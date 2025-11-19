import { useEffect, useState } from "react";
import { apiRequest } from "@/services/api";
import { toast } from "sonner";

export interface Category {
  id: number;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiRequest("/categories", {}, false);
        setCategories(data || []);
        setError(null);
      } catch (err: any) {
        console.error("Erro ao buscar categorias:", err);
        toast.error("Falha ao Carregar Categorias", {
          description:
            "Não foi possível carregar a lista de categorias do servidor.",
        });
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}
