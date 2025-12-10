"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      const res = await fetch(`/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || "Login failed";
        setError(msg);
        return;
      }

      // store token (if returned) and user
      if (data?.token) {
        localStorage.setItem("token", data.token);
      } else {
        localStorage.removeItem("token");
      }
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

      // notify other parts of the app (same-tab) that auth changed
      try {
        window.dispatchEvent(new Event('authChange'));
      } catch (e) {
        // ignore
      }

      // redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                <span className="text-slate-600">Remember me</span>
              </label>

              <Link href="/forgot" className="text-sm text-indigo-600">Forgot?</Link>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-4">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-indigo-600">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
