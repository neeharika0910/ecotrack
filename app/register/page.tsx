"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create an account</h2>
        <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <Label>Username</Label>
            <Input value={username} onChange={(e)=>setUsername(e.target.value)} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e)=>setEmail(e.target.value)} required type="email" />
          </div>
          <div>
            <Label>Password</Label>
            <Input value={password} onChange={(e)=>setPassword(e.target.value)} required type="password" />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <Button className="w-full bg-green-600 text-white" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
          <div className="text-sm text-gray-600 mt-2">
            Already have an account? <a href="/login" className="text-green-600">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}
