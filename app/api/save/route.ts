import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.split(";").map(c=>c.trim()).find(c=>c.startsWith("ecotrack_token="));
    if (!match) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const token = match.split("=")[1];
    const payload = verifyJWT(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { date, transport, energy, food, total } = body;
    if (!date) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const entry = await prisma.emission.create({
      data: {
        userId: payload.userId,
        date: new Date(date),
        transport: parseFloat(String(transport)),
        energy: parseFloat(String(energy)),
        food: parseFloat(String(food)),
        total: parseFloat(String(total) || "0")
      }
    });

    const user = await prisma.user.findUnique({ where: { id: payload.userId }, include: { emissions: true } });
    const ecoScore = user ? user.ecoScore : 0;
    const newScore = Math.min(100, Math.max(0, ecoScore + (Math.random() * 10 - 5)));
    await prisma.user.update({ where: { id: payload.userId }, data: { ecoScore: newScore } });

    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
