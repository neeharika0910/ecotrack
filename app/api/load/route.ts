import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.split(";").map(c=>c.trim()).find(c=>c.startsWith("ecotrack_token="));
    if (!match) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const token = match.split("=")[1];
    const payload = verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { emissions: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const emissions = user.emissions.map(e => ({
      id: e.id,
      date: e.date.toISOString().split("T")[0],
      transport: e.transport,
      energy: e.energy,
      food: e.food,
      total: e.total
    }));

    return NextResponse.json({ user: { id: user.id, username: user.username, email: user.email, ecoScore: user.ecoScore }, emissions });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
