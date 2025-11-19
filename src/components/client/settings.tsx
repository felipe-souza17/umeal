"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Trash2, Edit2, Plus, MapPin } from "lucide-react";
import { AddressDialog } from "../common/address-dialog";

interface UserData {
  name: string;
  email: string;
}

interface Address {
  id: number;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

export function ClientSettings() {
  const [user, setUser] = useState<UserData>({ name: "", email: "" });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUserData = async () => {
    try {
      const userData = await apiRequest("/users/me");
      const addressData = await apiRequest("/addresses/me");

      setUser(userData);
      setAddresses(addressData || []);
    } catch (error) {
      toast.error("Erro ao carregar dados do perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify({ name: user.name, email: user.email }),
      });
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Falha ao salvar perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este endereço?")) return;

    try {
      await apiRequest(`/addresses/${id}`, { method: "DELETE" });
      setAddresses(addresses.filter((addr) => addr.id !== id));
      toast.success("Endereço removido!");
    } catch (error) {
      toast.error("Erro ao remover endereço.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (isLoading)
    return <div className="p-8 text-center">Carregando configurações...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground">
        Configurações e Perfil
      </h2>

      {/* 1. Edição de Dados Pessoais */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-accent/30 text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 2. Gerenciamento de Endereços */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Meus Endereços</CardTitle>

          <AddressDialog onAddressSaved={fetchUserData} />
        </CardHeader>
        <CardContent className="space-y-3">
          {addresses.length === 0 ? (
            <div className="text-center py-5 text-muted-foreground border border-dashed border-border rounded-lg">
              <MapPin className="h-6 w-6 mx-auto mb-2" />
              Nenhum endereço cadastrado.
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className="flex items-center justify-between p-3 bg-accent/20 border border-border rounded-lg"
              >
                <p className="text-sm">
                  <span className="font-semibold">
                    {addr.street}, {addr.number}
                  </span>{" "}
                  - {addr.neighborhood}, {addr.city}/{addr.state}
                </p>
                <div className="flex gap-2">
                  <AddressDialog
                    onAddressSaved={fetchUserData}
                    initialAddress={addr}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-900/10"
                    onClick={() => handleDeleteAddress(addr.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
