import { NextRequest, NextResponse } from "next/server";
import { addOrder, getOrders } from "@/lib/orders";
import { cookies } from "next/headers";

/* POST /api/orders — customer submits their cart */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, total } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const order = addOrder(items, total);
    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/* GET /api/orders — admin reads all orders (protected) */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  return NextResponse.json({ orders: getOrders() });
}
