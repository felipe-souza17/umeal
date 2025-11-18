"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/services/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { id: 1, name: "Japonesa" },
  { id: 2, name: "Brasileira" },
  { id: 3, name: "Pizza" },
  { id: 4, name: "Hambúrguer" },
  { id: 5, name: "Italiana" },
  { id: 6, name: "Árabe" },
  { id: 7, name: "Chinesa" },
  { id: 8, name: "Mexicana" },
  { id: 9, name: "Lanches" },
  { id: 10, name: "Açaí" },
  { id: 11, name: "Sobremesas" },
  { id: 12, name: "Padaria" },
  { id: 13, name: "Bebidas" },
  { id: 14, name: "Saudável" },
  { id: 15, name: "Vegetariana" },
];

interface RestaurantSetupProps {
  onSuccess: () => void;
}

export function RestaurantSetup({ onSuccess }: RestaurantSetupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handleBlurCep = async () => {
    const cleanCep = zipCode.replace(/\D/g, "");

    if (cleanCep.length === 8) {
      setIsSearchingCep(true);
      try {
        const data = await apiRequest(`/addresses/cep/${cleanCep}`);

        if (data) {
          setStreet(data.logradouro || "");
          setNeighborhood(data.bairro || "");
          setCity(data.localidade || "");
          setState(data.uf || "");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const addressPayload = {
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode: zipCode.replace(/\D/g, ""),
        latitude: 0.0,
        longitude: 0.0,
      };

      const addressResponse = await apiRequest("/addresses", {
        method: "POST",
        body: JSON.stringify(addressPayload),
      });

      if (!addressResponse || !addressResponse.id) {
        throw new Error("Falha ao criar endereço");
      }

      const restaurantPayload = {
        restaurantName: name,
        cnpj: cnpj.replace(/\D/g, ""),
        categoryIds: [parseInt(categoryId)],
        addressId: addressResponse.id,
      };

      await apiRequest("/restaurants", {
        method: "POST",
        body: JSON.stringify(restaurantPayload),
      });

      toast.success("Restaurante Inaugurado!", {
        description: "Você já pode cadastrar seu cardápio e receber pedidos!",
        duration: 4000,
      });

      onSuccess();
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Falha na Configuração", {
        description:
          "Ocorreu um erro ao salvar as informações. Verifique os dados e o CNPJ.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">
            Configuração da Loja
          </CardTitle>
          <CardDescription>
            Finalize o cadastro para começar a receber pedidos no uMeal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-slate-700 pb-2">
                Dados do Estabelecimento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="res-name">Nome Fantasia</Label>
                  <Input
                    id="res-name"
                    placeholder="Ex: Burger King do Centro"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="res-cnpj">CNPJ</Label>
                  <Input
                    id="res-cnpj"
                    placeholder="00.000.000/0001-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2 col-span-full">
                  <Label>Categoria Principal</Label>
                  <Select onValueChange={setCategoryId} required>
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder="Selecione o tipo de comida" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* --- Seção: Endereço --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-slate-700 pb-2">
                Localização
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <div className="relative">
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      onBlur={handleBlurCep}
                      maxLength={9}
                      required
                      disabled={isLoading}
                    />
                    {isSearchingCep && (
                      <div className="absolute right-3 top-2.5">
                        <Loader2 className="h-5 w-5 animate-spin text-foreground" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="street">Logradouro</Label>
                  <Input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    disabled={isLoading || isSearchingCep}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="123"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    required
                    disabled={isLoading || isSearchingCep}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={city}
                    readOnly
                    className="bg-slate-900/50 text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">UF</Label>
                  <Input
                    id="state"
                    value={state}
                    readOnly
                    className="bg-slate-900/50 text-slate-400"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-foreground"
              disabled={isLoading || isSearchingCep}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading
                ? "Finalizando Cadastro..."
                : "Inaugurar Meu Restaurante"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
