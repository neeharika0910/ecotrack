import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export function createJWT(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (e) {
    return null;
  }
}

export function setTokenCookie(res: NextResponse, token: string) {
  const cookie = serialize("ecotrack_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  res.headers.append("Set-Cookie", cookie);
  return res;
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
