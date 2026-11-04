import { NextRequest, NextResponse } from "next/server";
import { confirmDelivery } from "@/lib/orders";

/* POST /api/orders/:id/confirm — livreur entre le code fourni par le client */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { code } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Code manquant" }, { status: 400 });
  }

  const result = confirmDelivery(id, code.trim());

  if (result === "not_found") {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
  if (result === "wrong_code") {
    return NextResponse.json({ error: "Code incorrect" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
