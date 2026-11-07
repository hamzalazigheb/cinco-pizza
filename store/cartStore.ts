import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartSize = "senior" | "mega" | "boisson";

export interface CartItem {
  cartId:      string;   // unique per cart line (pizzaId + size + ingredients hash)
  pizzaId:     string;
  name:        string;
  image:       string;
  size:        CartSize;
  price:       number;
  ingredients: string[]; // customized list
  quantity:    number;
}

interface CartState {
  items:       CartItem[];
  isOpen:      boolean;

  addItem:     (item: Omit<CartItem, "cartId" | "quantity">) => void;
  removeItem:  (cartId: string) => void;
  updateQty:   (cartId: string, delta: number) => void;
  clearCart:   () => void;
  openCart:    () => void;
  closeCart:   () => void;
  toggleCart:  () => void;

  total:       () => number;
  count:       () => number;
}

function makeCartId(pizzaId: string, size: CartSize, ingredients: string[]) {
  return `${pizzaId}-${size}-${[...ingredients].sort().join(",")}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem: (item) => {
        const cartId = makeCartId(item.pizzaId, item.size, item.ingredients);
        set((s) => {
          const existing = s.items.find((i) => i.cartId === cartId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...s.items, { ...item, cartId, quantity: 1 }] };
        });
        // auto-open cart after adding
        set({ isOpen: true });
      },

      removeItem: (cartId) =>
        set((s) => ({ items: s.items.filter((i) => i.cartId !== cartId) })),

      updateQty: (cartId, delta) =>
        set((s) => ({
          items: s.items
            .map((i) => i.cartId === cartId ? { ...i, quantity: i.quantity + delta } : i)
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart:() => set((s) => ({ isOpen: !s.isOpen })),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      count: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "cinco-cart",
      partialize: (s) => ({ items: s.items }),
    }
  )
);
