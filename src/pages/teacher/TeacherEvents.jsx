import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

const Field = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#34d399" }}>
      {label}
    </label>
    {children}
  </div>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2 7-7 7 7 2 2M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0v-4a1 1 0 011-1h2a1 1 0 011 1v4" />
  </svg>
);

const inputStyle = {
  backgroundColor: "rgba(15,23,42,0.8)",
  border: "1px solid rgba(100,116,139,0.4)",
  borderRadius: 12,
  padding: "12px 16px",
  fontSize: 14,
  color: "#e2e8f0",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
};

export default function PostEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  const isValid = title.trim() && date && description.trim();

  const postEvent = async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.post("/events", { title, description, date, created_by: 1 });
      setSuccess(true);
      setTitle("");
      setDescription("");
      setDate("");
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Failed to post event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (name) => focused === name
    ? { ...inputStyle, borderColor: "#34d399", boxShadow: "0 0 0 3px rgba(52,211,153,0.1)" }
    : inputStyle;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", position: "relative", overflow: "hidden" }}>

      {/* Background effects */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "fixed", top: -100, right: -100, width: 500, height: 500, background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -150, left: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <motion.button
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.08, backgroundColor: "rgba(52,211,153,0.1)" }}
              whileTap={{ scale: 0.93 }}
              style={{ position: "fixed", top: 24, left: 24, zIndex: 50, backgroundColor: "rgba(30,41,59,0.9)", border: "1px solid rgba(100,116,139,0.4)", backdropFilter: "blur(8px)", borderRadius: 14, padding: 12, color: "#34d399", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s" }}
            >
              <HomeIcon />
            </motion.button>

      <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 10 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 36 }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, background: "linear-gradient(135deg, #34d399, #06b6d4)", borderRadius: 16, marginBottom: 16, boxShadow: "0 0 32px rgba(52,211,153,0.25)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0f1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="12" y1="14" x2="12" y2="18" />
              <line x1="10" y1="16" x2="14" y2="16" />
            </svg>
          </motion.div>

          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", margin: 0, letterSpacing: "-0.02em" }}>
            Post <span style={{ color: "#34d399" }}>Event</span>
          </h1>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Campus Communication Portal
          </p>
        </motion.div>

        {/* Success Banner */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ marginBottom: 20, padding: "14px 18px", backgroundColor: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 14, color: "#34d399", fontSize: 13, fontWeight: 500, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <span style={{ fontSize: 16 }}>✓</span> Event published successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ marginBottom: 20, padding: "14px 18px", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, color: "#f87171", fontSize: 13, textAlign: "center" }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ backgroundColor: "rgba(30,41,59,0.6)", border: "1px solid rgba(100,116,139,0.25)", borderRadius: 24, padding: 32, backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", gap: 24 }}
        >

          {/* Event Title */}
          <Field label="Event Title">
            <input
              placeholder="e.g. Annual Sports Meet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setFocused("title")}
              onBlur={() => setFocused(null)}
              style={focusStyle("title")}
            />
          </Field>

          {/* Scheduled Date */}
          <Field label="Scheduled Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onFocus={() => setFocused("date")}
              onBlur={() => setFocused(null)}
              style={{ ...focusStyle("date"), colorScheme: "dark" }}
            />
          </Field>

          {/* Description */}
          <Field label="Event Details">
            <textarea
              placeholder="Provide a brief description of the event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocused("desc")}
              onBlur={() => setFocused(null)}
              rows={5}
              style={{ ...focusStyle("desc"), resize: "vertical", minHeight: 120 }}
            />
          </Field>

          {/* Character count hint */}
          <div style={{ marginTop: -16, textAlign: "right" }}>
            <span style={{ fontSize: 11, color: description.length > 0 ? "#475569" : "transparent" }}>
              {description.length} characters
            </span>
          </div>

          {/* Submit */}
          <motion.button
            onClick={postEvent}
            disabled={loading || !isValid}
            whileHover={isValid && !loading ? { scale: 1.02, boxShadow: "0 0 32px rgba(52,211,153,0.3)" } : {}}
            whileTap={isValid && !loading ? { scale: 0.98 } : {}}
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: 14,
              border: "none",
              cursor: isValid && !loading ? "pointer" : "not-allowed",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.02em",
              transition: "all 0.2s",
              background: isValid && !loading
                ? "linear-gradient(135deg, #34d399, #06b6d4)"
                : "rgba(51,65,85,0.6)",
              color: isValid && !loading ? "#0a0f1e" : "#475569",
              boxShadow: isValid && !loading ? "0 4px 20px rgba(52,211,153,0.2)" : "none",
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #0a0f1e", borderTopColor: "transparent", borderRadius: "50%" }}
                />
                Publishing…
              </span>
            ) : "Publish Event"}
          </motion.button>
        </motion.div>

        <p style={{ textAlign: "center", marginTop: 28, color: "#334155", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Secure Academic Information System
        </p>
      </div>
    </div>
  );
}