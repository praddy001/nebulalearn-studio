import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "@/utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

export default function TeacherUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }

      alert("File uploaded successfully ✅");
      setFile(null);
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] py-20 px-6 flex flex-col items-center relative overflow-hidden text-slate-200">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
      
      {/* Floating Home Button */}
      <motion.button
        onClick={() => navigate("/dashboard")}
        whileHover={{ scale: 1.1, backgroundColor: "#10b981", color: "#fff" }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-8 left-8 z-50 bg-slate-800/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl text-emerald-400 shadow-2xl transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </motion.button>

      <div className="max-w-2xl w-full relative z-10">
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-3"
          >
            <div className="p-3.5 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl text-slate-900 shadow-lg shadow-emerald-500/20">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight">Upload <span className="text-emerald-400">Notes</span></h1>
          </motion.div>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">Teacher Material Repository</p>
        </header>

        {/* MAIN UPLOAD CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-[3rem] p-12 shadow-2xl flex flex-col gap-10"
        >
          <div className="space-y-6 text-center">
             <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-[2rem] py-16 px-6 group hover:border-emerald-500/50 transition-all cursor-pointer relative">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="p-4 bg-slate-900 rounded-full text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-200">
                  {file ? file.name : "Select study materials"}
                </h3>
                <p className="text-slate-500 text-sm mt-2">
                  {file ? `Size: ${Math.round(file.size / 1024)} KB` : "Supports PDF, DOCX, and PPT"}
                </p>
             </div>
          </div>

          {/* SUBMIT BUTTON */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <button 
              onClick={uploadFile}
              disabled={loading || !file}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-9 rounded-[1.5rem] text-xl shadow-[0_10px_40px_rgba(16,185,129,0.2)] disabled:opacity-30 disabled:bg-slate-700 transition-all border-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                "Initiate Upload"
              )}
            </button>
          </motion.div>
        </motion.div>

        <p className="text-center mt-12 text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em]">
          Secure File Distribution Protocol
        </p>
      </div>
    </div>
  );
}