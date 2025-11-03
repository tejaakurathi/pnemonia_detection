import { useEffect, useState } from "react"
import axios from "axios"
import { animate,motion } from "framer-motion"
import { Users, ScanLine, Target } from "lucide-react"

function Counter({ value, suffix = "" }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(0, value || 0, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(latest),
    })  
    return () => controls.stop()
  }, [value])

  const formatted =
    typeof value === "number"
      ? suffix === "%"
        ? Math.round(display)
        : Math.floor(display)
      : 0

  return (
    <span>
      {formatted.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScans: 0,
    averageAccuracy: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchStats = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/stats")
      const data = res.data || {}
      setStats({
        totalUsers: Number(data.totalUsers) || 0,
        totalScans: Number(data.totalScans) || 0,
        averageAccuracy: Math.round(
          (Number(data.averageAccuracy) || 0) * 100
        ),
      })
    } catch (e) {
      console.error("Stats fetch error:", e)
      setError(
        e.response?.data?.message || e.message || "⚠️ Failed to load stats"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const items = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-sky-50 to-white",
    },
    {
      label: "Total Scans",
      value: stats.totalScans,
      icon: ScanLine,
      color: "from-emerald-50 to-white",
    },
    {
      label: "Accuracy Rate",
      value: stats.averageAccuracy,
      suffix: "%",
      icon: Target,
      color: "from-amber-50 to-white",
    },
  ]

  return (
    <section id="stats" className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <h3 className="text-3xl font-bold text-slate-900 text-center">
          Live Stats
        </h3>

        {/* Error message */}
        {error && (
          <div className="mt-4 text-center">
            <p className="text-rose-600 font-medium">{error}</p>
            <button
              onClick={fetchStats}
              className="mt-2 px-4 py-1.5 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className={`rounded-2xl border bg-gradient-to-br ${item.color} 
              p-8 text-center shadow-sm hover:shadow-md transition`}
            >
              <div className="flex justify-center">
                <item.icon className="h-10 w-10 text-sky-600" />
              </div>
              <div className="mt-4 text-4xl font-extrabold text-slate-900">
                {loading ? (
                  <span className="block h-8 w-20 mx-auto bg-slate-200 rounded animate-pulse" />
                ) : (
                  <Counter value={item.value} suffix={item.suffix} />
                )}
              </div>
              <div className="mt-2 text-slate-600 font-medium">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
