import { motion } from "framer-motion";
import { useRef } from "react";
import Stats from "../components/Stats";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-medical-bg.jpg";

export default function Home() {
  const statsRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section with Fixed Background */}
      <section
        className="relative min-h-[100vh] flex items-center justify-center bg-fixed bg-center bg-cover"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Overlay for readability */}

        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white"
          >
            Pneumonia Detection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-4 text-lg text-white"
          >
            Upload chest X-rays and get AI-powered predictions with confidence
            and optional segmentation maps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <button
              onClick={() => navigate("/upload")}
              className="inline-block rounded-lg bg-sky-600 px-6 py-3 text-white shadow hover:bg-sky-700"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </section>

      {/* Scrollable Content */}
      <Stats ref={statsRef} />
    </div>
  );
}
