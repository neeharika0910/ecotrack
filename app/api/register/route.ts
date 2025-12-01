import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createJWT, setTokenCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) return NextResponse.json({ error: "User exists" }, { status: 409 });

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { username, email, password: hashed, ecoScore: 0 },
    });

    const token = createJWT(user.id);
    const res = NextResponse.json({ user: { id: user.id, username: user.username, email: user.email } });
    setTokenCookie(res, token);
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
