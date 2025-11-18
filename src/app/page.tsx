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
import { apiRequest } from "@/services/api";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<
    "welcome" | "login" | "signup"
  >("welcome");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"CLIENT" | "RESTAURANT">("CLIENT");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const authData = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const token = authData.token;
      localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.message || "Falha ao fazer login. Verifique suas credenciais."
      );
    } finally {
      setIsLoading(false);
    }
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
    if (password !== confirmPassword) {
      setError("Senhas não correspondem");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint =
        userType === "CLIENT"
          ? "/users/register-client"
          : "/users/register-owner";

      const payload = {
        name,
        email,
        password,
      };

      await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Conta criada com sucesso! Faça login para continuar.");
      setCurrentPage("login");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
      toast.error("Falha na Configuração", {
        description: "Erro ao criar conta. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentPage === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">uMeal</h1>
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
                className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-foreground"
                onClick={() => {
                  setCurrentPage("login");
                  setError("");
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
                }}
              >
                Criar Conta
              </Button>
            </CardContent>
          </Card>
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
              <h1 className="text-3xl font-bold text-foreground hover:opacity-80 transition-opacity">
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
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-foreground placeholder:text-slate-500"
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
                    className="bg-slate-700/50 border-slate-600 text-foreground placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-slate-400">
            Não tem conta?{" "}
            <button
              onClick={() => {
                setCurrentPage("signup");
                setError("");
              }}
              className="text-foreground hover:underline font-medium"
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
            <h1 className="text-3xl font-bold text-foreground hover:opacity-80 transition-opacity">
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
          <CardContent className="pt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-foreground placeholder:text-slate-500"
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
                  className="bg-slate-700/50 border-slate-600 text-foreground placeholder:text-slate-500"
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
                  className="bg-slate-700/50 border-slate-600 text-foreground placeholder:text-slate-500"
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
                  className="bg-slate-700/50 border-slate-600 text-foreground placeholder:text-slate-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-700">
                <Label>Quero usar o uMeal como:</Label>
                <RadioGroup
                  value={userType}
                  onValueChange={(value) =>
                    setUserType(value as "CLIENT" | "RESTAURANT")
                  }
                >
                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      userType === "CLIENT"
                        ? "border-primary bg-primary/10"
                        : "border-slate-700 hover:bg-slate-700/50"
                    }`}
                  >
                    <RadioGroupItem value="CLIENT" id="client" />
                    <Label
                      htmlFor="client"
                      className="flex-1 cursor-pointer mb-0"
                    >
                      <div className="font-semibold">Cliente</div>
                      <div className="text-xs text-slate-400">
                        Peça comida de restaurantes
                      </div>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      userType === "RESTAURANT"
                        ? "border-primary bg-primary/10"
                        : "border-slate-700 hover:bg-slate-700/50"
                    }`}
                  >
                    <RadioGroupItem value="RESTAURANT" id="restaurant" />
                    <Label
                      htmlFor="restaurant"
                      className="flex-1 cursor-pointer mb-0"
                    >
                      <div className="font-semibold">Dono de Restaurante</div>
                      <div className="text-xs text-slate-400">
                        Gerencie seu restaurante e cardápio
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-foreground"
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
            }}
            className="text-foreground hover:underline font-medium"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
