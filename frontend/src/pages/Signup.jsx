import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User } from "lucide-react";
import { signUp, signIn, confirmSignUp } from "aws-amplify/auth";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agree, setAgree] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [showVerify, setShowVerify] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp({
        username: form.username,
        password: form.password,
        options: { userAttributes: { email: form.email } },
      });
      setShowVerify(true);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await confirmSignUp({
        username: form.username,
        confirmationCode: verificationCode,
      });
      alert("Account verified successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (showVerify) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <form
          onSubmit={onVerify}
          className="w-full max-w-md rounded-xl border bg-white p-6 shadow"
        >
          <h2 className="text-2xl font-semibold">Verify Email</h2>
          <p className="mt-1 text-sm text-slate-600">
            Enter the 6-digit code sent to your email.
          </p>
          {error && (
            <div className="mt-3 bg-rose-50 border border-rose-200 p-2 text-rose-700">
              {error}
            </div>
          )}
          <div className="mt-4">
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="mt-5 w-full bg-sky-600 text-white rounded-md py-2"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-500 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Create Account
        </h2>

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
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter a username"
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
            Email Address
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full rounded-md border px-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
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
              placeholder="Create a password"
              className="w-full rounded-md border px-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-md border px-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirmPassword: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </span>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </form>
    </div>
  );
}
