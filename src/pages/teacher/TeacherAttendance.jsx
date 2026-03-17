import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";  // ← fixed
import api from "@/services/api";

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2 7-7 7 7 2 2M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0v-4a1 1 0 011-1h2a1 1 0 011 1v4" />
  </svg>
);

const StatusToggle = ({ status, onChange }) => {
  const isPresent = status === "Present";
  return (
    <div
      onClick={() => onChange(isPresent ? "Absent" : "Present")}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
        backgroundColor: isPresent ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
        border: `1px solid ${isPresent ? "rgba(52,211,153,0.35)" : "rgba(248,113,113,0.35)"}`,
        borderRadius: 10, padding: "6px 14px", fontSize: 13, fontWeight: 600,
        color: isPresent ? "#34d399" : "#f87171", transition: "all 0.2s", userSelect: "none",
        minWidth: 110,
      }}
    >
      <span style={{
        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
        backgroundColor: isPresent ? "#34d399" : "#f87171",
        boxShadow: `0 0 6px ${isPresent ? "#34d399" : "#f87171"}`,
      }} />
      {isPresent ? "Present" : "Absent"}
    </div>
  );
};

export default function Attendance() {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFetching(true);
    api.get("/students")
      .then((res) => {
        setStudents(res.data);
        const init = {};
        res.data.forEach((s) => { init[s.id] = { status: "Present", selected: false }; });
        setAttendanceData(init);
      })
      .catch(() => setError("Failed to load students."))
      .finally(() => setFetching(false));
  }, []);

  const handleCheckbox = (id) =>
    setAttendanceData((prev) => ({ ...prev, [id]: { ...prev[id], selected: !prev[id].selected } }));

  const handleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    const upd = {};
    students.forEach((s) => { upd[s.id] = { ...attendanceData[s.id], selected: next }; });
    setAttendanceData(upd);
  };

  const handleStatusChange = (id, status) =>
    setAttendanceData((prev) => ({ ...prev, [id]: { ...prev[id], status } }));

  const bulkStatus = (status) => {
    const upd = {};
    students.forEach((s) => { upd[s.id] = { ...attendanceData[s.id], status }; });
    setAttendanceData(upd);
  };

  const submitAttendance = async () => {
    const records = students
      .filter((s) => attendanceData[s.id]?.selected)
      .map((s) => ({ student_id: s.id, status: attendanceData[s.id].status }));
    if (!date) { setError("Please select a date."); return; }
    if (records.length === 0) { setError("Please select at least one student."); return; }
    setLoading(true); setError(null); setSuccess(null);
    try {
      await api.post("/attendance/bulk", { date, records });
      setSuccess(`Attendance marked for ${records.length} student${records.length > 1 ? "s" : ""}.`);
      const reset = {};
      students.forEach((s) => { reset[s.id] = { status: "Present", selected: false }; });
      setAttendanceData(reset);
      setSelectAll(false);
      setDate("");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Failed to submit attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    String(s.roll_no || "").includes(search)
  );

  const selectedCount = students.filter((s) => attendanceData[s.id]?.selected).length;
  const presentCount = students.filter((s) => attendanceData[s.id]?.status === "Present").length;
  const absentCount = students.length - presentCount;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1e", padding: "48px 24px", color: "#e2e8f0", position: "relative", overflow: "hidden" }}>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(16,185,129,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.03) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "fixed", top: -80, right: -80, width: 480, height: 480, background: "radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -120, left: -80, width: 380, height: 380, background: "radial-gradient(circle,rgba(6,182,212,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* Home Button */}
      <motion.button
        onClick={() => navigate("/dashboard")}
        whileHover={{ scale: 1.08, backgroundColor: "rgba(52,211,153,0.1)" }}
        whileTap={{ scale: 0.93 }}
        style={{ position: "fixed", top: 24, left: 24, zIndex: 50, backgroundColor: "rgba(30,41,59,0.9)", border: "1px solid rgba(100,116,139,0.4)", backdropFilter: "blur(8px)", borderRadius: 14, padding: 12, color: "#34d399", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s" }}
      >
        <HomeIcon />
      </motion.button>

      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 10 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>
            Teacher Control Panel · Academic Year 2024–25
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", margin: 0 }}>
            Mark <span style={{ color: "#34d399" }}>Attendance</span>
          </h1>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: 16, padding: "13px 18px", backgroundColor: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 14, color: "#34d399", fontSize: 13, fontWeight: 500, textAlign: "center" }}>
              ✓ {success}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: 16, padding: "13px 18px", backgroundColor: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 14, color: "#f87171", fontSize: 13, textAlign: "center" }}>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ backgroundColor: "rgba(30,41,59,0.6)", border: "1px solid rgba(100,116,139,0.25)", borderRadius: 20, padding: 24, marginBottom: 16, backdropFilter: "blur(12px)" }}>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 16 }}>
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#34d399", marginBottom: 8 }}>
                Session Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ backgroundColor: "rgba(15,23,42,0.8)", border: "1px solid rgba(100,116,139,0.4)", borderRadius: 12, padding: "10px 14px", fontSize: 14, color: "#e2e8f0", outline: "none", width: "100%", boxSizing: "border-box", colorScheme: "dark" }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                { label: "✓ All Present", fn: () => bulkStatus("Present"), color: "#34d399" },
                { label: "✗ All Absent", fn: () => bulkStatus("Absent"), color: "#f87171" },
              ].map(({ label, fn, color }) => (
                <button key={label} onClick={fn}
                  style={{ padding: "10px 18px", borderRadius: 12, border: `1px solid ${color}40`, backgroundColor: `${color}10`, color, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background-color 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = `${color}20`}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = `${color}10`}
                >
                  {label}
                </button>
              ))}

              <motion.button
                onClick={submitAttendance}
                disabled={loading || selectedCount === 0 || !date}
                whileHover={selectedCount > 0 && date && !loading ? { scale: 1.03, boxShadow: "0 0 24px rgba(52,211,153,0.3)" } : {}}
                whileTap={selectedCount > 0 && date && !loading ? { scale: 0.97 } : {}}
                style={{
                  padding: "10px 22px", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 700,
                  cursor: selectedCount > 0 && date && !loading ? "pointer" : "not-allowed",
                  background: selectedCount > 0 && date && !loading ? "linear-gradient(135deg,#34d399,#06b6d4)" : "rgba(51,65,85,0.6)",
                  color: selectedCount > 0 && date && !loading ? "#0a0f1e" : "#475569",
                  transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ display: "inline-block", width: 13, height: 13, border: "2px solid #0a0f1e", borderTopColor: "transparent", borderRadius: "50%" }} />
                    Submitting…
                  </>
                ) : `Submit (${selectedCount})`}
              </motion.button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 20, marginTop: 18, flexWrap: "wrap" }}>
            {[
              { dot: "#94a3b8", label: `Total: ${students.length}` },
              { dot: "#60a5fa", label: `Selected: ${selectedCount}` },
              { dot: "#34d399", label: `Present: ${presentCount}` },
              { dot: "#f87171", label: `Absent: ${absentCount}` },
            ].map(({ dot, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#94a3b8" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: dot, flexShrink: 0 }} />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ backgroundColor: "rgba(30,41,59,0.5)", border: "1px solid rgba(100,116,139,0.25)", borderRadius: 20, overflow: "hidden", backdropFilter: "blur(12px)" }}>

          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(100,116,139,0.2)" }}>
            <input
              placeholder="Search student by name or roll no…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ backgroundColor: "rgba(15,23,42,0.8)", border: "1px solid rgba(100,116,139,0.35)", borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "#e2e8f0", outline: "none", width: 280, boxSizing: "border-box" }}
            />
          </div>

          <div style={{ overflowX: "auto", maxHeight: 520, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "rgba(15,23,42,0.95)", backdropFilter: "blur(8px)" }}>
                <tr style={{ borderBottom: "1px solid rgba(100,116,139,0.25)" }}>
                  <th style={{ padding: "14px 16px", textAlign: "left", width: 44 }}>
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll}
                      style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#34d399" }} />
                  </th>
                  {["Roll No", "Student Name", "Status"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748b" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fetching ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(100,116,139,0.15)" }}>
                      {[44, 80, 200, 120].map((w, j) => (
                        <td key={j} style={{ padding: "14px 16px" }}>
                          <div style={{ height: 14, width: w, backgroundColor: "rgba(100,116,139,0.2)", borderRadius: 6 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "60px 16px", textAlign: "center", color: "#475569" }}>
                      {search ? "No students match your search." : "No students found."}
                    </td>
                  </tr>
                ) : filtered.map((student, i) => {
                  const isSelected = attendanceData[student.id]?.selected;
                  return (
                    <motion.tr key={student.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.025 }}
                      style={{ borderBottom: "1px solid rgba(100,116,139,0.12)", backgroundColor: isSelected ? "rgba(52,211,153,0.04)" : "transparent", transition: "background-color 0.2s" }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = isSelected ? "rgba(52,211,153,0.08)" : "rgba(100,116,139,0.08)"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = isSelected ? "rgba(52,211,153,0.04)" : "transparent"}
                    >
                      <td style={{ padding: "13px 16px" }}>
                        <input type="checkbox" checked={isSelected || false} onChange={() => handleCheckbox(student.id)}
                          style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#34d399" }} />
                      </td>
                      <td style={{ padding: "13px 16px", color: "#94a3b8", fontWeight: 600 }}>
                        {student.roll_no || student.rollNo || i + 1}
                      </td>
                      <td style={{ padding: "13px 16px", color: "#f1f5f9", fontWeight: 500 }}>
                        {student.name}
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <StatusToggle
                          status={attendanceData[student.id]?.status || "Present"}
                          onChange={(val) => handleStatusChange(student.id, val)}
                        />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!fetching && filtered.length > 0 && (
            <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(100,116,139,0.2)", fontSize: 11, color: "#475569" }}>
              Showing {filtered.length} of {students.length} student{students.length !== 1 ? "s" : ""}
            </div>
          )}
        </motion.div>

        <p style={{ textAlign: "center", marginTop: 28, color: "#334155", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Secure Academic Record Entry System · Powered by Modern Education Platform
        </p>
      </div>
    </div>
  );
}