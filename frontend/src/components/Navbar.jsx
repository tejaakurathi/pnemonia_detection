import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const onLogout = () => {
    logout()
    navigate("/")
  }

  const navLinks = !isAuthenticated
    ? [
        { to: "/", label: "Home" },
        { to: "/login", label: "Login", type: "button-primary" },
        { to: "/signup", label: "Signup", type: "button-outline" },
      ]
    : [
        { to: "/dashboard", label: "Dashboard" },
        { to: "#", label: "Logout", onClick: onLogout, type: "button-danger" },
      ]

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur bg-white/80 border-b border-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-sky-700">
          Medical<span className="text-slate-800">AI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link, i) =>
            link.type?.includes("button") ? (
              link.label === "Logout" ? (
                // Real button for logout
                <button
                  key={i}
                  onClick={link.onClick}
                  className={`px-4 py-1.5 rounded-md font-medium transition ${
                    link.type === "button-primary"
                      ? "bg-sky-600 text-white hover:bg-sky-700"
                      : link.type === "button-outline"
                      ? "border border-sky-600 text-sky-700 hover:bg-sky-50"
                      : "bg-rose-600 text-white hover:bg-rose-700"
                  }`}
                >
                  {link.label}
                </button>
              ) : (
                // Use NavLink for navigation buttons
                <NavLink
                  key={i}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-md font-medium transition ${
                      link.type === "button-primary"
                        ? "bg-sky-600 text-white hover:bg-sky-700"
                        : "border border-sky-600 text-sky-700 hover:bg-sky-50"
                    } ${isActive ? "ring-2 ring-sky-400" : ""}`
                  }
                >
                  {link.label}
                </NavLink>
              )
            ) : (
              <NavLink
                key={i}
                to={link.to}
                className={({ isActive }) =>
                  `font-medium ${
                    isActive ? "text-sky-700" : "text-slate-700 hover:text-sky-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md hover:bg-slate-100"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-2 px-4 pb-4 border-t border-slate-200">
          {navLinks.map((link, i) =>
            link.type?.includes("button") ? (
              link.label === "Logout" ? (
                <button
                  key={i}
                  onClick={() => {
                    link.onClick?.()
                    setIsOpen(false)
                  }}
                  className="px-4 py-2 rounded-md font-medium text-left bg-rose-600 text-white hover:bg-rose-700 transition"
                >
                  {link.label}
                </button>
              ) : (
                <NavLink
                  key={i}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-2 py-2 rounded-md font-medium ${
                      isActive ? "text-sky-700 bg-sky-50" : "text-slate-700 hover:text-sky-700"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            ) : (
              <NavLink
                key={i}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-2 py-2 rounded-md font-medium ${
                    isActive ? "text-sky-700 bg-sky-50" : "text-slate-700 hover:text-sky-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </div>
      )}
    </nav>
  )
}
