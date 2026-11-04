import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/orders";
import { cookies } from "next/headers";

/* PATCH /api/orders/:id — admin updates status */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = ["nouveau", "en préparation", "terminé"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const ok = updateOrderStatus(id, status);
  if (!ok) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  return NextResponse.json({ success: true });
}
