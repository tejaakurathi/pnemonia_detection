import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User } from 'lucide-react'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agree, setAgree] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!agree) {
      setError("You must agree to the Terms and Privacy Policy")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/signup', {
        username: form.username,
        email: form.email,
        password: form.password,
      })
      login({ token: res.data.token, user: res.data.user })
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-500 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 mt-1">Join us to start your medical AI journey</p>

        {error && (
          <div className="mt-4 rounded bg-rose-50 p-2 text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        {/* Full Name */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Your full name"
              className="w-full rounded-md border px-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full rounded-md border px-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Create a strong password"
              className="w-full rounded-md border px-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full rounded-md border px-10 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Terms & Privacy */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={e => setAgree(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span>
            I agree to the{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </span>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        {/* Already have account */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </form>
    </div>
  )
}
