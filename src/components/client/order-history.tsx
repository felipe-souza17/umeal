"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, UtensilsCrossed, CheckCircle } from "lucide-react";
import { formatOrderNumber } from "@/utils/order-number-format";

interface OrderItem {
  productName: string;
  quantity: number;
}

interface Order {
  id: string;
  restaurantName: string;
  totalPrice: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "IN_PREPARATION"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
  createdAt: string;
  items: OrderItem[];
}

const getStatusDetails = (status: Order["status"]) => {
  switch (status) {
    case "PENDING":
      return { label: "Pendente", color: "bg-yellow-600", icon: Clock };
    case "CONFIRMED":
      return { label: "Confirmado", color: "bg-blue-600", icon: CheckCircle };
    case "IN_PREPARATION":
      return {
        label: "Em Preparo",
        color: "bg-orange-600",
        icon: UtensilsCrossed,
      };
    case "OUT_FOR_DELIVERY":
      return { label: "Saiu para Entrega", color: "bg-primary", icon: Package };
    case "DELIVERED":
      return { label: "Entregue", color: "bg-green-600", icon: CheckCircle };
    case "CANCELLED":
      return { label: "Cancelado", color: "bg-red-600", icon: Clock };
    default:
      return { label: "Desconhecido", color: "bg-gray-600", icon: Clock };
  }
};

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiRequest("/orders");
        setOrders(data || []);
      } catch (error) {
        console.error("Erro ao carregar pedidos", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading)
    return <div className="p-8 text-center">Carregando histórico...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Meus Pedidos</h2>
      <p className="text-slate-400">
        Acompanhe seus pedidos recentes e o status de entrega.
      </p>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium text-foreground">
            Nenhum pedido encontrado.
          </h3>
          <p className="text-muted-foreground">
            Que tal explorar os restaurantes e fazer o primeiro?
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusDetail = getStatusDetails(order.status);
            const Icon = statusDetail.icon;

            return (
              <Card
                key={order.id}
                className="bg-card border-border hover:border-primary transition-all"
              >
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/50">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold text-foreground">
                      {order.restaurantName || "Restaurante Desconhecido"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Pedido {formatOrderNumber(order.id)}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${statusDetail.color}`}
                  >
                    <Icon className="w-3 h-3" />
                    {statusDetail.label}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-primary">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.totalPrice)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Data:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-foreground pt-2 border-t border-border/50">
                    <span className="font-medium">Itens:</span>{" "}
                    {order.items
                      .map((i) => `${i.quantity}x ${i.productName}`)
                      .join(", ")}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
