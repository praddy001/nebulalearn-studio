import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Note {
  id: number;
  filename: string;
  size: number;
  uploaded_at: string;
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Not authenticated");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/files/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const downloadFile = async (fileId: number, filename: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authenticated");

    try {
      const res = await fetch(`http://localhost:5000/api/files/${fileId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Server error during download");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] py-12 px-6 relative overflow-hidden text-slate-200">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
      
      {/* Floating Home Button (Matching your Logic) */}
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Available <span className="text-emerald-400">Notes</span></h1>
          </motion.div>
          <p className="text-slate-400 ml-16 font-medium">Access and download your study materials.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20 text-emerald-400 animate-pulse">Loading secure files...</div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notes.map((note, i) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 10 }}
                  className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-emerald-500/50 transition-all shadow-xl"
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    {/* File Icon */}
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 group-hover:border-emerald-500/30 transition-colors">
                      <span className="text-emerald-500 font-bold text-xs uppercase">PDF</span>
                    </div>
                    
                    <div className="overflow-hidden">
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                        {note.filename}
                      </h3>
                      <div className="flex gap-4 text-xs text-slate-500 font-medium mt-1">
                        <span>{Math.round(note.size / 1024)} KB</span>
                        <span>•</span>
                        <span>{new Date(note.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => downloadFile(note.id, note.filename)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/10"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {notes.length === 0 && (
              <p className="text-center text-slate-500 py-10">No notes found in the archive.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}