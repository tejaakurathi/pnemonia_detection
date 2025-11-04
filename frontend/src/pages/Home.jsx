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
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-800">
            Why Choose MedicalAI?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 bg-white shadow-lg rounded-2xl hover:shadow-2xl transition">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2920/2920328.png"
                alt="AI Accuracy"
                className="w-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                AI-Powered Accuracy
              </h3>
              <p className="text-gray-600">
                Built using deep learning, our model ensures highly accurate
                detection of pneumonia across diverse X-ray images.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-2xl hover:shadow-2xl transition">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4221/4221469.png"
                alt="Fast Results"
                className="w-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                Instant Predictions
              </h3>
              <p className="text-gray-600">
                Upload your X-ray and get results within seconds. No waiting, no
                delays — just instant AI-powered insights.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-2xl hover:shadow-2xl transition">
              <img
                src="https://cdn-icons-png.flaticon.com/512/535/535239.png"
                alt="Data Security"
                className="w-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                Secure & Confidential
              </h3>
              <p className="text-gray-600">
                Your medical images are encrypted and never stored permanently —
                your privacy is our top priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="text-sky-600 text-4xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Upload X-ray</h3>
              <p className="text-gray-600">
                Simply upload a chest X-ray image through our secure platform.
              </p>
            </div>
            <div>
              <div className="text-sky-600 text-4xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our deep learning model analyzes the scan for pneumonia
                indicators.
              </p>
            </div>
            <div>
              <div className="text-sky-600 text-4xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-gray-600">
                Receive prediction results and optional heatmaps highlighting
                affected areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Confidence Section */}
      <section className="py-20 bg-gradient-to-b from-sky-50 to-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
            See the Power of AI in Action
          </h2>
          <p className="text-gray-600 mb-10 text-lg">
            Our model learns from thousands of X-rays to make predictions with
            incredible precision. Each upload helps the AI get smarter and more
            accurate.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-wrap justify-center gap-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 w-72 hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold text-sky-600 mb-3">+50,000</h3>
              <p className="text-gray-700">X-rays analyzed worldwide</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 w-72 hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold text-sky-600 mb-3">94%</h3>
              <p className="text-gray-700">Average prediction accuracy</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 w-72 hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold text-sky-600 mb-3">
                Real-Time
              </h3>
              <p className="text-gray-700">Analysis under 3 seconds</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Testimonials Section */}
      <section className="py-20 bg-sky-50 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
            What Our Users Say
          </h2>
          <motion.div
            className="flex flex-col md:flex-row justify-center gap-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full md:w-1/3 hover:shadow-2xl transition">
              <p className="text-gray-700 italic mb-4">
                “The predictions were spot-on! It even highlighted the infection
                areas clearly. This is the future of diagnostics.”
              </p>
              <h4 className="text-sky-600 font-semibold">— Dr. R. Mehta</h4>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full md:w-1/3 hover:shadow-2xl transition">
              <p className="text-gray-700 italic mb-4">
                “Super fast and simple. I uploaded an X-ray and got the result
                instantly with a confidence score. Loved the UI!”
              </p>
              <h4 className="text-sky-600 font-semibold">— Medical Student</h4>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full md:w-1/3 hover:shadow-2xl transition">
              <p className="text-gray-700 italic mb-4">
                “As a patient, I felt reassured seeing AI confidence levels
                before meeting my doctor. Beautiful platform.”
              </p>
              <h4 className="text-sky-600 font-semibold">— Patient User</h4>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Animated Upload Teaser Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-500 text-white text-center relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-4xl font-bold mb-4">
            Your X-ray Could Help Save Lives
          </h2>
          <p className="text-lg mb-8 text-sky-100">
            Every scan contributes to improving our AI — making it more
            accurate, reliable, and capable of helping doctors globally.
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="bg-white text-sky-600 font-semibold px-10 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition"
          >
            Upload Your X-ray Now →
          </button>
        </motion.div>

        {/* Floating Icons (dynamic background) */}
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/2920/2920328.png"
          alt=""
          className="absolute top-10 left-10 w-16 opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/4221/4221469.png"
          alt=""
          className="absolute bottom-12 right-10 w-16 opacity-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
      </section>
    </div>
  );
}
