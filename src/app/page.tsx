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
import { AlertCircle, Loader2 } from "lucide-react";
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
  const [isAnimating, setIsAnimating] = useState(false);

  const changePage = (newPage: "welcome" | "login" | "signup") => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setError("");
      if (newPage !== "signup") {
        setName("");
        setConfirmPassword("");
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const authData = await apiRequest(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        false
      );

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

      await apiRequest(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        false
      );

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

  const transitionClasses = `transition-opacity duration-300 ease-in-out ${
    isAnimating ? "opacity-0" : "opacity-100"
  }`;

  if (currentPage === "welcome") {
    return (
      <div
        className={`min-h-screen bg-background flex items-center justify-center p-4 ${transitionClasses}`}
      >
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-8">
            {/* Corrigido para text-primary (Laranja) ou text-foreground para tema */}
            <h1 className="text-4xl font-bold text-primary mb-2">uMeal</h1>
            <p className="text-muted-foreground">
              Plataforma Premium de Entrega de Alimentos
            </p>
          </div>

          <Card className="bg-card border-border backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Bem-vindo ao uMeal</CardTitle>
              <CardDescription>
                Peça como cliente ou gerencie como restaurante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white"
                onClick={() => changePage("login")}
              >
                Entrar
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base border-border hover:bg-accent hover:text-accent-foreground"
                onClick={() => changePage("signup")}
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
      <div
        className={`min-h-screen bg-background flex items-center justify-center p-4 ${transitionClasses}`}
      >
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-8">
            <button
              onClick={() => changePage("welcome")}
              className="inline-block mb-4"
            >
              <h1 className="text-3xl font-bold text-primary hover:opacity-80 transition-opacity">
                uMeal
              </h1>
            </button>
            <h2 className="text-2xl font-bold mb-2">Entrar</h2>
            <p className="text-muted-foreground">
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

          <Card className="bg-card border-border backdrop-blur">
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
                    className="bg-input/50 border-border placeholder:text-muted-foreground"
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
                    className="bg-input/50 border-border placeholder:text-muted-foreground"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-muted-foreground">
            Não tem conta?{" "}
            <button
              onClick={() => changePage("signup")}
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
    <div
      className={`min-h-screen bg-background flex items-center justify-center p-4 ${transitionClasses}`}
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <button
            onClick={() => changePage("welcome")}
            className="inline-block mb-4"
          >
            <h1 className="text-3xl font-bold text-primary hover:opacity-80 transition-opacity">
              uMeal
            </h1>
          </button>
          <h2 className="text-2xl font-bold mb-2">Criar Conta</h2>
          <p className="text-muted-foreground">Junte-se ao uMeal hoje</p>
        </div>

        {error && (
          <Alert variant="destructive" className="border-red-800 bg-red-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-card border-border backdrop-blur">
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
                  className="bg-input/50 border-border placeholder:text-muted-foreground"
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
                  className="bg-input/50 border-border placeholder:text-muted-foreground"
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
                  className="bg-input/50 border-border placeholder:text-muted-foreground"
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
                  className="bg-input/50 border-border placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-border">
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
                        : "border-border hover:bg-accent/30"
                    }`}
                  >
                    <RadioGroupItem value="CLIENT" id="client" />
                    <Label
                      htmlFor="client"
                      className="flex-1 cursor-pointer mb-0"
                    >
                      <div className="font-semibold">Cliente</div>
                      <div className="text-xs text-muted-foreground">
                        Peça comida de restaurantes
                      </div>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      userType === "RESTAURANT"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent/30"
                    }`}
                  >
                    <RadioGroupItem value="RESTAURANT" id="restaurant" />
                    <Label
                      htmlFor="restaurant"
                      className="flex-1 cursor-pointer mb-0"
                    >
                      <div className="font-semibold">Dono de Restaurante</div>
                      <div className="text-xs text-muted-foreground">
                        Gerencie seu restaurante e cardápio
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground">
          Já tem uma conta?{" "}
          <button
            onClick={() => changePage("login")}
            className="text-primary hover:underline font-medium"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
