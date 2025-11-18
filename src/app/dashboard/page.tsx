"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientHome } from "@/components/client/client-home";
import { RestaurantKanban } from "@/components/restaurant/restaurant-kanban";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<"client" | "restaurant" | null>(
    null
  );
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const role = localStorage.getItem("userRole") as
      | "client"
      | "restaurant"
      | null;
    const name =
      localStorage.getItem("userName") ||
      localStorage.getItem("userEmail") ||
      "User";

    if (!role) {
      router.push("/auth");
      return;
    }

    setUserRole(role);
    setUserName(name);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    router.push("/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">uMeal</h1>
          <p className="text-slate-400">Loading...</p>
        </div>
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
                {userRole})
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-slate-300"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {userRole === "client" ? <ClientHome /> : <RestaurantKanban />}
      </main>
    </div>
  );
}
