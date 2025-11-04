import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock } from "lucide-react";
import { signIn, fetchAuthSession, signOut } from "aws-amplify/auth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ If user already signed in, sign them out first
      await signOut({ global: true }).catch(() => {});

      // ✅ Sign in the user
      const user = await signIn({
        username: form.username,
        password: form.password,
      });

      console.log("✅ Signed in user:", user);

      // ✅ Fetch tokens using new API
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) throw new Error("Failed to fetch Cognito token");

      // ✅ Save token locally or in context
      login({
        token,
        user: {
          username: form.username,
          email: user?.userId || "",
        },
      });

      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      console.error("Sign-in error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-500 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600">
            <Lock className="text-white w-6 h-6" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mt-1">
          Sign in to access your dashboard
        </p>

        {error && (
          <div className="mt-4 rounded bg-rose-50 p-2 text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="username"
              className="w-full rounded-md border px-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-md border px-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" className="rounded border-gray-300" />{" "}
            Remember me
          </label>
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
}
