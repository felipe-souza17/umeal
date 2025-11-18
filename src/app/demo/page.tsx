"use client";

import Link from "next/link";
import { ClientHome } from "@/components/client/client-home";
import { RestaurantKanban } from "@/components/restaurant/restaurant-kanban";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DemoPage() {
  const [userRole, setUserRole] = useState<"client" | "restaurant">("client");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-foreground">uMeal</h1>
              <span className="px-3 py-1 text-sm bg-slate-700/50 text-slate-300 rounded-full">
                Demo Mode
              </span>

              {/* Role Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setUserRole("client")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    userRole === "client"
                      ? "bg-primary text-foreground-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-border"
                  }`}
                >
                  Client
                </button>
                <button
                  onClick={() => setUserRole("restaurant")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    userRole === "restaurant"
                      ? "bg-primary text-foreground-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-border"
                  }`}
                >
                  Restaurant
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
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
