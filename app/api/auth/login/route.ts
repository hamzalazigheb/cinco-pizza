import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;
  const token     = process.env.ADMIN_TOKEN;

  if (!validUser || !validPass || !token) {
    return NextResponse.json(
      { error: "Variables d'environnement manquantes" },
      { status: 500 }
    );
  }

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 8, // 8 hours
    path:     "/",
  });
  return res;
}
