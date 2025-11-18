"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";

export interface CartItem {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
  };
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  addToCart: (product: any, restaurantId: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("uMealCart");
    const savedRestId = localStorage.getItem("uMealCartRestId");
    if (savedCart) setItems(JSON.parse(savedCart));
    if (savedRestId) setRestaurantId(savedRestId);
  }, []);

  useEffect(() => {
    localStorage.setItem("uMealCart", JSON.stringify(items));
    if (restaurantId) localStorage.setItem("uMealCartRestId", restaurantId);
    else localStorage.removeItem("uMealCartRestId");
  }, [items, restaurantId]);

  const addToCart = (product: any, newRestaurantId: string) => {
    if (restaurantId && restaurantId !== newRestaurantId) {
      toast.error("Carrinho em Conflito", {
        description:
          "Você já tem itens de outro restaurante. Limpe o carrinho para continuar.",
        action: {
          label: "Limpar Carrinho",
          onClick: () => {
            clearCart();
            addToCart(product, newRestaurantId);
          },
        },
        duration: 5000,
      });
      return;
    }

    setRestaurantId(newRestaurantId);

    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`${product.name} adicionado!`, {
        description: `Total de itens no carrinho: ${cartCount + 1}`,
        duration: 1500,
      });
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.product.id !== productId);
      if (newItems.length === 0) setRestaurantId(null);
      return newItems;
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setItems((prev) => {
      return prev
        .map((i) => {
          if (i.product.id === productId) {
            const newQty = Math.max(0, i.quantity + delta);
            return { ...i, quantity: newQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);
    });

    if (items.length === 1 && items[0].quantity + delta <= 0) {
      setRestaurantId(null);
    }
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    localStorage.removeItem("uMealCart");
    localStorage.removeItem("uMealCartRestId");
  };

  const cartTotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
