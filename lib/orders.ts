/* ── In-memory order store ──────────────────────────────────────
   Uses globalThis so orders survive across route-handler calls
   within the same Node.js process (demo only — resets on restart).
─────────────────────────────────────────────────────────────── */

export interface OrderItem {
  name:        string;
  size:        "senior" | "mega";
  quantity:    number;
  price:       number;
  ingredients: string[];
  image:       string;
}

export interface Order {
  id:        string;
  items:     OrderItem[];
  total:     number;
  createdAt: string; // ISO string
  status:    "nouveau" | "en préparation" | "terminé";
}

declare global {
  // eslint-disable-next-line no-var
  var __cinco_orders: Order[] | undefined;
}

/* Initialise once per process */
if (!globalThis.__cinco_orders) {
  globalThis.__cinco_orders = [];
}

export function getOrders(): Order[] {
  return globalThis.__cinco_orders!;
}

export function addOrder(items: OrderItem[], total: number): Order {
  const order: Order = {
    id:        Math.random().toString(36).slice(2, 9).toUpperCase(),
    items,
    total,
    createdAt: new Date().toISOString(),
    status:    "nouveau",
  };
  globalThis.__cinco_orders!.unshift(order); // newest first
  return order;
}

export function updateOrderStatus(id: string, status: Order["status"]): boolean {
  const order = globalThis.__cinco_orders!.find((o) => o.id === id);
  if (!order) return false;
  order.status = status;
  return true;
}
