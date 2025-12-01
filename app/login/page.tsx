"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
        <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <Label>Username or Email</Label>
            <Input value={usernameOrEmail} onChange={(e)=>setUsernameOrEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Password</Label>
            <Input value={password} onChange={(e)=>setPassword(e.target.value)} required type="password" />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <Button className="w-full bg-green-600 text-white" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <div className="text-sm text-gray-600 mt-2">
            New here? <a href="/register" className="text-green-600">Create account</a>
          </div>
        </form>
      </div>
    </div>
  );
}
