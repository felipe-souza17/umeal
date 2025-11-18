import { OrderStatus, Order } from './restaurant-kanban'
import { OrderCard } from './order-card'
import { ChevronRight } from 'lucide-react'

interface KanbanColumnProps {
  title: string
  count: number
  orders: Order[]
  onMoveOrder: (orderId: string, newStatus: OrderStatus) => void
  currentStatus: OrderStatus
}

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  'pending': { bg: 'bg-chart-1/10', text: 'text-chart-1', border: 'border-chart-1' },
  'confirmed': { bg: 'bg-chart-2/10', text: 'text-chart-2', border: 'border-chart-2' },
  'in-preparation': { bg: 'bg-chart-3/10', text: 'text-chart-3', border: 'border-chart-3' },
  'out-for-delivery': { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary' },
  'delivered': { bg: 'bg-chart-4/10', text: 'text-chart-4', border: 'border-chart-4' }
}

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  'pending': 'confirmed',
  'confirmed': 'in-preparation',
  'in-preparation': 'out-for-delivery',
  'out-for-delivery': 'delivered',
  'delivered': null
}

export function KanbanColumn({ title, count, orders, onMoveOrder, currentStatus }: KanbanColumnProps) {
  const colors = STATUS_COLORS[currentStatus]
  const nextStatus = NEXT_STATUS[currentStatus]

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      {/* Column Header */}
      <div className={`mb-4 rounded-lg ${colors.bg} p-3 border ${colors.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-semibold ${colors.text}`}>{title}</p>
            <p className="text-lg font-bold text-foreground">{count}</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="group">
              <OrderCard order={order} />
              {nextStatus && (
                <button
                  onClick={() => onMoveOrder(order.id, nextStatus)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary py-2 px-3 text-sm font-medium text-secondary-foreground transition-all hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100"
                >
                  Move to {STATUS_COLORS[nextStatus]?.text === 'text-chart-2' ? 'Confirmed' : ''}
                  {nextStatus === 'in-preparation' ? 'Preparation' : ''}
                  {nextStatus === 'out-for-delivery' ? 'Delivery' : ''}
                  {nextStatus === 'delivered' ? 'Completed' : ''}
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-background/50 py-8 text-center">
            <p className="text-sm text-muted-foreground">No orders</p>
          </div>
        )}
      </div>
    </div>
  )
}
