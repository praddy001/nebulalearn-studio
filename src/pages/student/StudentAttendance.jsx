import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function AttendanceView() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/attendance/student")
      .then(res => {
        // Sort records by date descending (newest first)
        const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecords(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalDays = records.length;
  const presentDays = records.filter(r => r.status === "Present").length;
  const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-[#0f172a] py-12 px-6 relative overflow-hidden text-slate-200">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />

      {/* Floating Home Button */}
      <motion.button
        onClick={() => navigate("/dashboard")}
        whileHover={{ scale: 1.1, backgroundColor: "#10b981", color: "#fff" }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-6 left-6 z-50 bg-slate-800/80 backdrop-blur-md border border-slate-700 p-3 rounded-2xl text-emerald-400 shadow-2xl transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </motion.button>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-2"
          >
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl text-slate-900 shadow-lg shadow-emerald-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">My <span className="text-emerald-400">Attendance</span></h1>
          </motion.div>
          <p className="text-slate-400 ml-16 font-medium">Track your presence and consistency.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20 text-emerald-400 animate-pulse">Calculating records...</div>
        ) : (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-[2rem] bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Days</p>
                <p className="text-4xl font-black text-white">{totalDays}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-[2rem] bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Present</p>
                <p className="text-4xl font-black text-emerald-400">{presentDays}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm flex items-center justify-between">
                <div>
                  <p className="text-emerald-400/70 text-sm font-bold uppercase tracking-wider mb-1">Percentage</p>
                  <p className="text-4xl font-black text-emerald-400">{percentage}%</p>
                </div>
                {/* Simple Visual Ring */}
                <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-emerald-500 rotate-45" />
              </motion.div>
            </div>

            {/* RECORDS LIST */}
            <div className="space-y-3">
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4 ml-2">History</h3>
              <AnimatePresence>
                {records.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-slate-800/30 border border-slate-700/30 rounded-2xl p-4 flex items-center justify-between hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${r.status === "Present" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-red-500"}`} />
                      <span className="text-slate-300 font-medium">{new Date(r.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${
                      r.status === "Present" 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {r.status}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {records.length === 0 && (
                <div className="text-center py-20 bg-slate-800/20 rounded-[2rem] border border-dashed border-slate-700">
                   <p className="text-slate-500">No attendance data logged yet.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}