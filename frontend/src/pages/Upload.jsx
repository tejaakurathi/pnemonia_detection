import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { CloudUpload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function Upload() {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const onUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center text-sky-700"
      >
        Upload Chest X-ray
      </motion.h2>
      <p className="text-center text-slate-600 mt-3 text-lg">
        Get instant AI-based Pneumonia detection with accuracy and confidence
        score.
      </p>

      {/* Upload Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="mt-10 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-300 bg-gradient-to-b from-sky-50 to-white p-10 text-slate-600 hover:shadow-xl hover:border-sky-400 transition duration-300"
      >
        <CloudUpload className="w-14 h-14 text-sky-500 mb-4" />
        <div className="text-lg font-medium">Drag & Drop your X-ray here</div>
        <div className="my-2 text-slate-500">or</div>
        <label className="inline-block rounded-lg bg-sky-600 px-6 py-2 text-white font-medium cursor-pointer hover:bg-sky-700 transition">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          Choose File
        </label>
        {file && (
          <div className="mt-3 text-slate-800 text-sm">
            <CheckCircle2 className="inline mr-2 text-green-500" />
            <span className="font-semibold">Selected:</span> {file.name}
          </div>
        )}
      </motion.div>

      {/* Upload Button */}
      <div className="text-center mt-6">
        <button
          onClick={onUpload}
          disabled={loading || !file}
          className="rounded-xl bg-sky-600 px-6 py-3 text-white font-semibold hover:bg-sky-700 disabled:opacity-60 shadow-md transition flex items-center justify-center mx-auto gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
            </>
          ) : (
            "Upload & Analyze"
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-center gap-2"
        >
          <AlertCircle className="text-rose-600" />
          {error}
        </motion.div>
      )}

      {/* Result Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10 rounded-2xl border border-sky-100 bg-white shadow-lg p-8"
        >
          <div className="text-2xl font-semibold text-sky-700 mb-3 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" /> Analysis Result
          </div>
          <div className="text-slate-700 text-lg mb-2">
            <span className="font-medium">Prediction:</span>{" "}
            <span className="text-sky-600 font-semibold">
              {result.prediction}
            </span>
          </div>
          {"confidence" in result && (
            <div className="text-slate-700 text-lg">
              <span className="font-medium">Confidence:</span>{" "}
              {typeof result.confidence === "number"
                ? (result.confidence * 100).toFixed(1) + "%"
                : "-"}
            </div>
          )}
          {result.segmentationMapUrl && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              src={result.segmentationMapUrl}
              alt="Segmentation"
              className="mt-6 max-h-96 w-full object-contain rounded-lg border border-sky-100 shadow-sm"
            />
          )}
        </motion.div>
      )}
    </div>
  );
}
