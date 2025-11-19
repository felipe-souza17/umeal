"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/services/api";
import { translateUserRole } from "@/utils/translate-user-role";

import { ClientHome } from "@/components/client/client-home";
import { RestaurantSetup } from "@/components/restaurant/restaurant-setup";
import { RestaurantKanban } from "@/components/restaurant/restaurant-kanban";
import { RestaurantMenu } from "@/components/restaurant/restaurant-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderHistory } from "@/components/client/order-history";
import { CartSidebar } from "@/components/client/cart-sidebar";
import { ClientSettings } from "@/components/client/settings";

export default function Dashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<
    "CLIENT" | "RESTAURANT_OWNER" | null
  >(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await apiRequest("/users/me");
        setUserRole(userData.role);

        if (userData.role === "RESTAURANT_OWNER") {
          try {
            const rests = await apiRequest("/restaurants/my-restaurant");
            if (rests && rests.id) {
              setRestaurantId(rests.id);
            }
          } catch (e) {
            setRestaurantId(null);
          }
        }

        if (userData && userData.role) {
          setUserName(userData.name);
        } else {
          throw new Error("Dados de usuário inválidos");
        }
      } catch (error) {
        console.error("Erro de autenticação:", error);
        localStorage.removeItem("token");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-slate-400">Carregando suas informações...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-foreground">uMeal</h1>
              <div className="text-sm text-slate-400">
                Bem-vindo(a),{" "}
                <span className="text-foreground transition-colors font-medium">
                  {userName}
                </span>{" "}
                ({translateUserRole(userRole || "")})
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-slate-300"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto  px-4 py-8 sm:px-6 lg:px-8">
        {userRole === "CLIENT" ? (
          <Tabs defaultValue="home" className="mx-auto max-w-7xl space-y-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3 bg-card">
              <TabsTrigger
                value="home"
                className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Restaurantes
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Meus Pedidos
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="outline-none">
              <ClientHome userName={userName} />
            </TabsContent>

            <TabsContent value="orders" className="outline-none">
              <OrderHistory />
            </TabsContent>

            <TabsContent value="settings" className="outline-none">
              <ClientSettings />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {!restaurantId ? (
              <RestaurantSetup onSuccess={() => window.location.reload()} />
            ) : (
              <Tabs defaultValue="orders" className="w-full space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-card">
                  <TabsTrigger value="orders">Pedidos (Kanban)</TabsTrigger>
                  <TabsTrigger value="menu">Cardápio</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="outline-none">
                  <RestaurantKanban restaurantId={restaurantId} />
                </TabsContent>

                <TabsContent value="menu" className="outline-none">
                  <RestaurantMenu restaurantId={restaurantId} />
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </main>

      {userRole === "CLIENT" && <CartSidebar />}
    </div>
  );
}
