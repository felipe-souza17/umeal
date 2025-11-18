import { formatOrderNumber } from "@/utils/order-number-format";
import { Order, OrderStatus } from "./restaurant-kanban";
import { Clock, MapPin, DollarSign } from "lucide-react";

interface OrderCardProps {
  order: Order;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "Pendente", color: "bg-chart-1/20 text-chart-1" },
  CONFIRMED: { label: "Confirmado", color: "bg-chart-2/20 text-chart-2" },
  IN_PREPARATION: { label: "Em Prep.", color: "bg-chart-3/20 text-chart-3" },
  OUT_FOR_DELIVERY: {
    label: "Saiu para entrega",
    color: "bg-primary/20 text-primary",
  },
  DELIVERED: { label: "Entregue", color: "bg-chart-4/20 text-chart-4" },
  CANCELLED: {
    label: "Cancelado",
    color: "bg-destructive/20 text-destructive",
  },
};

export function OrderCard({ order }: OrderCardProps) {
  const statusConfig = STATUS_CONFIG[order.status];

  return (
    <div className="rounded-lg border border-border bg-card p-3 transition-all hover:shadow-md hover:shadow-primary/10">
      {/* Header */}
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="font-semibold text-foreground">
            {formatOrderNumber(order.id)}
          </p>
          <p className="text-xs text-muted-foreground">{order.customerName}</p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${statusConfig.color}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Items Summary */}
      <div className="mb-3 space-y-1 border-t border-border pt-2">
        {order.items.slice(0, 2).map((item, idx) => (
          <p key={idx} className="text-xs text-muted-foreground">
            <span className="font-medium">{item.quantity}x</span>{" "}
            {item.productName}
          </p>
        ))}
        {order.items.length > 2 && (
          <p className="text-xs text-muted-foreground">
            +{order.items.length - 2} more items
          </p>
        )}
      </div>

      {/* Meta Info */}
      <div className="space-y-1 border-t border-border pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={14} />
          <span>{order.createdAt} (Est. )</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin size={14} />
          <span className="line-clamp-1">{order.deliveryAddress.street}</span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-2 border-t border-border pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Total
          </span>
          <span className="font-semibold text-primary">
            ${order.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
