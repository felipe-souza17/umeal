"use client";

import { useState, useEffect } from "react";
import { KanbanColumn } from "./kanban-column";
import { apiRequest } from "@/services/api";
import { toast } from "sonner";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PREPARATION"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: string;
  customerName: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  deliveryAddress: DeliveryAddress;
}

export interface DeliveryAddress {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

interface RestaurantKanbanProps {
  restaurantId: string;
}

export function RestaurantKanban({ restaurantId }: RestaurantKanbanProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await apiRequest(`/restaurants/${restaurantId}/orders`);

      setOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [restaurantId]);

  const moveOrder = async (orderId: string, newStatus: OrderStatus) => {
    const oldOrders = [...orders];
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Erro ao atualizar status", error);
      setOrders(oldOrders);
      toast.error("Erro ao atualizar status", {
        description: "Tente novamente mais tarde.",
      });
    }
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter((order) => order.status === status);
  };

  const columns: { status: OrderStatus; title: string }[] = [
    { status: "PENDING", title: "Pendente" },
    { status: "CONFIRMED", title: "Aceito" },
    { status: "IN_PREPARATION", title: "Em Preparo" },
    { status: "OUT_FOR_DELIVERY", title: "Saiu p/ Entrega" },
    { status: "DELIVERED", title: "Entregue" },
  ];

  if (isLoading)
    return <div className="text-center py-10">Carregando pedidos...</div>;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mb-8 space-y-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestão de Pedidos
          </h1>
          <p className="text-muted-foreground">
            Acompanhe os seus pedidos por aqui
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="text-sm text-foreground hover:underline"
        >
          Atualizar agora
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(320px, 1fr))`,
          }}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.status}
              title={column.title}
              count={getOrdersByStatus(column.status).length}
              orders={getOrdersByStatus(column.status)} // Atenção: OrderCard precisará aceitar OrderStatus em uppercase
              onMoveOrder={moveOrder}
              currentStatus={column.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
