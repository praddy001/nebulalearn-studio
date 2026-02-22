import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/events")
      .then(res => {
        const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: '2-digit', year: 'numeric' 
    });
  };

  return (
    // THEME: Deep Charcoal Background
    <div className="min-h-screen bg-[#0f172a] py-12 px-6 relative overflow-hidden">
      
      {/* Decorative Background Glow */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />

      {/* Floating Home Button - Keeping your /dashboard logic */}
      <motion.button
        onClick={() => navigate("/dashboard")}
        whileHover={{ scale: 1.1, backgroundColor: "#10b981", color: "#fff" }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-6 left-6 z-50 bg-slate-800/80 backdrop-blur-md shadow-2xl border border-slate-700 p-3 rounded-2xl text-emerald-400 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </motion.button>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-2"
          >
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl shadow-emerald-500/20 shadow-xl text-slate-900">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Upcoming <span className="text-emerald-400">Events</span></h1>
          </motion.div>
          <p className="text-slate-400 ml-16 font-medium">Your academic journey, scheduled.</p>
        </header>

        {/* Events List */}
        <div className="space-y-5">
          <AnimatePresence>
            {!loading && events.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 100, delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="group bg-white border-l-4 border-l-indigo-500 border-y border-r border-slate-200 rounded-r-3xl rounded-l-lg p-6 shadow-sm hover:shadow-xl hover:translate-x-2 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    {/* Index Badge */}
                    <div className="hidden sm:flex flex-col items-center justify-center bg-slate-900/50 group-hover:bg-emerald-500/10 w-16 h-16 rounded-2xl border border-slate-700 group-hover:border-emerald-500/30 transition-all">
                       <span className="text-[10px] font-black text-slate-500 group-hover:text-emerald-500 uppercase tracking-widest">Evnt</span>
                       <span className="text-xl font-bold text-slate-200 group-hover:text-emerald-400">0{i+1}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {e.title}
                      </h3>
                      <p className="text-slate-400 mt-2 line-clamp-2 leading-relaxed text-sm">
                        {e.description}
                      </p>
                    </div>
                  </div>

                  {/* Date Badge */}
                  <div className="flex items-center gap-3 self-end sm:self-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-5 py-2.5 rounded-2xl font-bold text-sm shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {formatDate(e.date)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 pt-8 border-t border-slate-800 text-center"
          >
            <p className="text-slate-500 text-sm tracking-widest uppercase font-bold">
              Showing {events.length} Active Events
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}