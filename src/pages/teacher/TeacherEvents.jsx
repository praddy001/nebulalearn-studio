import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PostEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const postEvent = async () => {
    try {
      setLoading(true);
      await api.post("/events", {
        title,
        description,
        date,
        created_by: 1,
      });

      alert("Event posted successfully");
      setTitle("");
      setDescription("");
      setDate("");
    } catch (err) {
      alert("Failed to post event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] py-12 px-6 flex flex-col items-center relative overflow-hidden text-slate-200">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full" />

      {/* Floating Home Button */}
      <motion.button
        onClick={() => navigate("/dashboard")}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 left-6 z-50 bg-slate-800/80 backdrop-blur-md border border-slate-700 p-3 rounded-xl text-emerald-400 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2 7-7 7 7 2 2M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0v-4a1 1 0 011-1h2a1 1 0 011 1v4"
          />
        </svg>
      </motion.button>

      <div className="max-w-xl w-full relative z-10">

        {/* Header */}
        <header className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl text-slate-900 shadow-md">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"></path>
                <path d="M12 11v4"></path>
                <path d="M10 13h4"></path>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">
              Post <span className="text-emerald-400">Event</span>
            </h1>
          </motion.div>
          <p className="text-slate-400 text-xs uppercase tracking-widest">
            Campus Communication Portal
          </p>
        </header>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-xl flex flex-col gap-6"
        >
          {/* Event Title */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Event Title
            </label>
            <Input
              placeholder="e.g. Annual Sports Meet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background text-foreground border-input focus-visible:ring-emerald-500"
            />
          </div>

          {/* Scheduled Date */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Scheduled Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-background text-foreground border-input focus-visible:ring-emerald-500/40"
            />
          </div>

          {/* Event Details */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
              Event Details
            </label>
            <textarea
              placeholder="Provide a brief description of the event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background text-foreground border border-input rounded-xl px-4 py-3 placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-emerald-500 min-h-[120px]"
/>
          </div>
          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={postEvent}
              disabled={loading || !title || !date || !description}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 rounded-xl text-base shadow-md disabled:opacity-30 disabled:bg-slate-700 transition-all"
            >
              {loading ? "Publishing..." : "Publish Event"}
            </Button>
          </motion.div>
        </motion.div>

        <p className="text-center mt-8 text-slate-500 text-[10px] uppercase tracking-widest">
          Secure Academic Information System
        </p>
      </div>
    </div>
  );
}
