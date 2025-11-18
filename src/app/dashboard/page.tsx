"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientHome } from "@/components/client/client-home";
import { RestaurantKanban } from "@/components/restaurant/restaurant-kanban";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/services/api";
import { translateUserRole } from "@/utils/translate-user-role";

export default function Dashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<
    "CLIENT" | "RESTAURANT_OWNER" | null
  >(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await apiRequest("/users/me");

        if (userData && userData.role) {
          setUserRole(userData.role);
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
              <h1 className="text-2xl font-bold text-primary">uMeal</h1>
              <div className="text-sm text-slate-400">
                Welcome,{" "}
                <span className="text-white font-medium">{userName}</span> (
                {translateUserRole(userRole || "")})
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

      {/* Main Content */}
      <main>
        {userRole === "CLIENT" ? <ClientHome /> : <RestaurantKanban />}
      </main>
    </div>
  );
}
