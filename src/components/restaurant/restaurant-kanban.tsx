'use client'

import { useState } from 'react'
import { KanbanColumn } from './kanban-column'
import { OrderCard } from './order-card'

export type OrderStatus = 'pending' | 'confirmed' | 'in-preparation' | 'out-for-delivery' | 'delivered'

export interface Order {
  id: string
  customerName: string
  items: { name: string; quantity: number; price: number }[]
  totalAmount: number
  status: OrderStatus
  orderTime: string
  estimatedTime: string
  address: string
}

const MOCK_ORDERS: Order[] = [
  {
    id: '#ORD001',
    customerName: 'John Smith',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
      { name: 'Caesar Salad', quantity: 1, price: 8.50 }
    ],
    totalAmount: 21.49,
    status: 'pending',
    orderTime: '14:32',
    estimatedTime: '14:45',
    address: '123 Main St, Downtown'
  },
  {
    id: '#ORD002',
    customerName: 'Emma Davis',
    items: [
      { name: 'Pepperoni Pizza', quantity: 2, price: 13.99 },
      { name: 'Garlic Bread', quantity: 1, price: 4.99 }
    ],
    totalAmount: 33.97,
    status: 'confirmed',
    orderTime: '14:28',
    estimatedTime: '14:58',
    address: '456 Oak Ave, Midtown'
  },
  {
    id: '#ORD003',
    customerName: 'Michael Chen',
    items: [
      { name: 'Veggie Pizza', quantity: 1, price: 11.99 },
      { name: 'Marinara Sauce', quantity: 2, price: 1.50 }
    ],
    totalAmount: 15.99,
    status: 'in-preparation',
    orderTime: '14:15',
    estimatedTime: '14:35',
    address: '789 Pine St, Downtown'
  },
  {
    id: '#ORD004',
    customerName: 'Sarah Johnson',
    items: [
      { name: 'Hawaiian Pizza', quantity: 1, price: 13.99 }
    ],
    totalAmount: 13.99,
    status: 'out-for-delivery',
    orderTime: '14:05',
    estimatedTime: '14:25',
    address: '321 Elm Rd, Uptown'
  },
  {
    id: '#ORD005',
    customerName: 'Alex Rodriguez',
    items: [
      { name: 'Quattro Formaggi', quantity: 1, price: 14.99 },
      { name: 'Tiramisu', quantity: 1, price: 6.99 }
    ],
    totalAmount: 21.98,
    status: 'delivered',
    orderTime: '13:45',
    estimatedTime: '14:15',
    address: '654 Maple Dr, East Side'
  },
  {
    id: '#ORD006',
    customerName: 'Lisa Wang',
    items: [
      { name: 'Prosciutto Pizza', quantity: 1, price: 15.99 }
    ],
    totalAmount: 15.99,
    status: 'pending',
    orderTime: '14:35',
    estimatedTime: '14:50',
    address: '987 Cedar Ln, West Side'
  },
  {
    id: '#ORD007',
    customerName: 'Tom Brady',
    items: [
      { name: 'Barbecue Chicken Pizza', quantity: 1, price: 14.99 },
      { name: 'Mozzarella Sticks', quantity: 1, price: 7.99 }
    ],
    totalAmount: 22.98,
    status: 'confirmed',
    orderTime: '14:18',
    estimatedTime: '14:48',
    address: '147 Birch Ln, Suburbs'
  },
  {
    id: '#ORD008',
    customerName: 'Nina Patel',
    items: [
      { name: 'Spinach & Ricotta Pizza', quantity: 1, price: 12.99 }
    ],
    totalAmount: 12.99,
    status: 'in-preparation',
    orderTime: '14:22',
    estimatedTime: '14:42',
    address: '258 Spruce St, Downtown'
  }
]

export function RestaurantKanban() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)

  const moveOrder = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status)
  }

  const columns: { status: OrderStatus; title: string; count: number }[] = [
    { status: 'pending', title: 'Pending', count: getOrdersByStatus('pending').length },
    { status: 'confirmed', title: 'Confirmed', count: getOrdersByStatus('confirmed').length },
    { status: 'in-preparation', title: 'In Preparation', count: getOrdersByStatus('in-preparation').length },
    { status: 'out-for-delivery', title: 'Out for Delivery', count: getOrdersByStatus('out-for-delivery').length },
    { status: 'delivered', title: 'Delivered', count: getOrdersByStatus('delivered').length }
  ]

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
        <p className="text-muted-foreground">Track and manage all incoming orders in real-time</p>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(320px, 1fr))` }}>
          {columns.map(column => (
            <KanbanColumn
              key={column.status}
              title={column.title}
              count={column.count}
              orders={getOrdersByStatus(column.status)}
              onMoveOrder={moveOrder}
              currentStatus={column.status}
            />
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {columns.map(column => (
          <div key={column.status} className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{column.title}</p>
            <p className="text-2xl font-bold text-primary">{column.count}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
