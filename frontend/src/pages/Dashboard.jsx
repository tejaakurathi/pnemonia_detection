import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems(res.data.images || []);
      } catch (e) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center text-lg text-sky-700 animate-pulse">
        Loading your scans...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-rose-700 font-medium">{error}</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-center text-sky-700">
          Your X-ray Analysis History
        </h2>
        <p className="mt-2 text-center text-slate-600">
          View all your uploaded scans and detailed predictions below.
        </p>

        {items.length === 0 && (
          <div className="mt-10 flex flex-col items-center text-slate-600">
            <p>No scans yet. </p>
            <a
              href="/upload"
              className="mt-2 inline-block rounded-md bg-sky-600 px-5 py-2 text-white font-medium shadow hover:bg-sky-700 transition"
            >
              Upload your first scan
            </a>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((img, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-slate-200 bg-white shadow-md transition-transform hover:-translate-y-2 hover:shadow-xl"
            >
              {img.imageUrl && (
                <img
                  src={img.imageUrl}
                  alt="X-ray"
                  className="h-48 w-full rounded-t-2xl object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-sky-700">
                  Prediction Result
                </h3>
                <div className="mt-2 text-slate-700 space-y-1">
                  <div>
                    <span className="font-medium">Prediction:</span>{" "}
                    {img.prediction}
                  </div>
                  <div>
                    <span className="font-medium">Confidence:</span>{" "}
                    {typeof img.confidence === "number"
                      ? `${(img.confidence * 100).toFixed(1)}%`
                      : "-"}
                  </div>
                  <div>
                    <span className="font-medium">Uploaded:</span>{" "}
                    {img.uploadedAt
                      ? new Date(img.uploadedAt).toLocaleString()
                      : "-"}
                  </div>
                </div>

                {img.segmentationMapUrl && (
                  <img
                    src={img.segmentationMapUrl}
                    alt="Segmentation"
                    className="mt-4 h-40 w-full rounded-lg object-cover border border-slate-200"
                  />
                )}
              </div>

              {/* Subtle glowing border effect */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-sky-400 transition duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
