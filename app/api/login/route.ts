import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createJWT, setTokenCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { usernameOrEmail, password } = await req.json();
    if (!usernameOrEmail || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }] },
    });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await comparePassword(password, user.password);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = createJWT(user.id);
    const res = NextResponse.json({ user: { id: user.id, username: user.username, email: user.email } });
    setTokenCookie(res, token);
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
