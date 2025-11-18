"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<
    "welcome" | "login" | "signup"
  >("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"client" | "restaurant">("client");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, insira um endereço de email válido");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      localStorage.setItem("userEmail", email);
      localStorage.setItem(
        "userRole",
        email.includes("restaurant") ? "restaurant" : "client"
      );
      router.push("/dashboard");
      setIsLoading(false);
    }, 500);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, insira um endereço de email válido");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Senhas não correspondem");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      localStorage.setItem("userRole", userType);
      router.push("/dashboard");
      setIsLoading(false);
    }, 500);
  };

  if (currentPage === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">uMeal</h1>
            <p className="text-slate-400">
              Plataforma Premium de Entrega de Alimentos
            </p>
          </div>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Bem-vindo ao uMeal</CardTitle>
              <CardDescription>
                Peça como cliente ou gerencie como restaurante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full h-12 text-base bg-primary hover:bg-primary/90"
                onClick={() => {
                  setCurrentPage("login");
                  setError("");
                  setEmail("");
                  setPassword("");
                }}
              >
                Entrar
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base border-slate-600 hover:bg-slate-700"
                onClick={() => {
                  setCurrentPage("signup");
                  setError("");
                  setName("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                Criar Conta
              </Button>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-3">
                  Quer explorar primeiro?
                </p>
                <Button
                  variant="ghost"
                  className="w-full h-10 text-slate-300 hover:bg-slate-700"
                  onClick={() => router.push("/demo")}
                >
                  Experimentar Demo
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-sm mb-1">Para Clientes</h3>
              <p className="text-xs text-slate-400">Peça de restaurantes</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur p-4 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-sm mb-1">Para Restaurantes</h3>
              <p className="text-xs text-slate-400">Gerencie pedidos</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-8">
            <button
              onClick={() => {
                setCurrentPage("welcome");
                setError("");
              }}
              className="inline-block mb-4"
            >
              <h1 className="text-3xl font-bold text-primary hover:opacity-80 transition-opacity">
                uMeal
              </h1>
            </button>
            <h2 className="text-2xl font-bold mb-2">Entrar</h2>
            <p className="text-slate-400">
              Insira suas credenciais para continuar
            </p>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="border-red-800 bg-red-900/20"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Bem-vindo de Volta</CardTitle>
              <CardDescription>Acesse sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400 mb-2">
                    Credenciais de Demo:
                  </p>
                  <p className="text-xs text-slate-300">
                    Cliente: client@example.com / password
                  </p>
                  <p className="text-xs text-slate-300">
                    Restaurante: restaurant@example.com / password
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-slate-400">
            Não tem conta?{" "}
            <button
              onClick={() => {
                setCurrentPage("signup");
                setError("");
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-primary hover:underline font-medium"
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <button
            onClick={() => {
              setCurrentPage("welcome");
              setError("");
            }}
            className="inline-block mb-4"
          >
            <h1 className="text-3xl font-bold text-primary hover:opacity-80 transition-opacity">
              uMeal
            </h1>
          </button>
          <h2 className="text-2xl font-bold mb-2">Criar Conta</h2>
          <p className="text-slate-400">Junte-se ao uMeal hoje</p>
        </div>

        {error && (
          <Alert variant="destructive" className="border-red-800 bg-red-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>
              Crie sua conta e escolha seu papel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-700">
                <Label>Sou um</Label>
                <RadioGroup
                  value={userType}
                  onValueChange={(value) =>
                    setUserType(value as "client" | "restaurant")
                  }
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                    <RadioGroupItem value="client" id="client" />
                    <Label
                      htmlFor="client"
                      className="flex-1 cursor-pointer mb-0"
                    >
                      <div className="font-semibold">Cliente</div>
                      <div className="text-sm text-slate-400">
                        Peça comida de restaurantes
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                    <RadioGroupItem value="restaurant" id="restaurant" />
                    <Label
                      htmlFor="restaurant"
                      className="flex-1 cursor-pointer mb-0"
                    >
                      <div className="font-semibold">Restaurante</div>
                      <div className="text-sm text-slate-400">
                        Gerencie os pedidos do seu restaurante
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-slate-400">
          Já tem uma conta?{" "}
          <button
            onClick={() => {
              setCurrentPage("login");
              setError("");
              setEmail("");
              setPassword("");
            }}
            className="text-primary hover:underline font-medium"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
