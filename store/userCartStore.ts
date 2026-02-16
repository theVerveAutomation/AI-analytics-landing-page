import {create} from "zustand";
import { CartItem } from "@/types";
import { persist } from "zustand/middleware";

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
    persist((set, get) => ({
        items: [],
        addItem: (item: Omit<CartItem, "quantity">) => {
            const existing = get().items.find(i => i.id === item.id);
            if (existing) {
                set({items: get().items.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i)});
            } else {
                set({items: [...get().items, {...item, quantity: 1}]});
            }
        },
        removeItem: (id: string) => {
            const existing = get().items.find(i => i.id === id);
            if (existing) {
                set({items: get().items.filter(i => i.id !== id)});
            }
        },
        increaseQuantity: (id: string) => {
            set({items: get().items.map(i => i.id === id ? {...i, quantity: i.quantity + 1} : i)});
        },
        decreaseQuantity: (id: string) => {
            const existing = get().items.find(i => i.id === id);
            if (existing) {
                if (existing.quantity == 0) {
                    return get().removeItem(id);
                }
                if (existing.quantity > 1) {
                    set({items: get().items.map(i => i.id === id ? {...i, quantity: i.quantity - 1} : i)});
                } else {
                    set({items: get().items.filter(i => i.id !== id)});
                }
            }
        },
        clearCart: () => {
            set({items: []});
        },
        getTotalPrice: () => {
            return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        getTotalItems: () => {
            return get().items.reduce((total, item) => total + item.quantity, 0);
        },
    }),
    {
      name: "cart-storage", // localStorage key
    })
);