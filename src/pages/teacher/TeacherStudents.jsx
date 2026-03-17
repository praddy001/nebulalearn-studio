import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

const getAttendanceColor = (pct) => {
  if (pct >= 75) return { text: "text-emerald-400", bar: "bg-emerald-400", badge: "bg-emerald-400/10 text-emerald-400 border-emerald-500/30" };
  if (pct >= 50) return { text: "text-amber-400", bar: "bg-amber-400", badge: "bg-amber-400/10 text-amber-400 border-amber-500/30" };
  return { text: "text-red-400", bar: "bg-red-400", badge: "bg-red-400/10 text-red-400 border-red-500/30" };
};

const SkeletonRow = () => (
  <tr className="border-b border-slate-700/50">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-slate-700/60 rounded animate-pulse" style={{ width: `${[60, 80, 40, 30, 30, 45][i]}%` }} />
      </td>
    ))}
  </tr>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2 7-7 7 7 2 2M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0v-4a1 1 0 011-1h2a1 1 0 011 1v4" />
  </svg>
);

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/attendance/students-summary");
      setStudents(res.data);
    } catch {
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = students
    .filter((s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortKey], valB = b[sortKey];
      const cmp = typeof valA === "string" ? valA.localeCompare(valB) : valA - valB;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const avgAttendance = students.length
    ? Math.round(students.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / students.length)
    : 0;

  const SortIcon = ({ col }) => (
    <span className={`ml-1 text-xs ${sortKey === col ? "text-emerald-400" : "text-slate-600"}`}>
      {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  const stats = [
    { label: "Total Students", value: students.length, color: "text-slate-100" },
    { label: "Avg Attendance", value: `${avgAttendance}%`, color: getAttendanceColor(avgAttendance).text },
    { label: "At Risk (<75%)", value: students.filter((s) => parseFloat(s.percentage) < 75).length, color: "text-red-400" },
  ];

  return (
    <div
      style={{ backgroundColor: "#0a0f1e", minHeight: "100vh" }}
      className="py-12 px-6 text-slate-200"
    >
      {/* Background grid */}
      <div
        style={{
          position: "fixed", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Home Button */}
      <motion.button
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.08, backgroundColor: "rgba(52,211,153,0.1)" }}
              whileTap={{ scale: 0.93 }}
              style={{ position: "fixed", top: 24, left: 24, zIndex: 50, backgroundColor: "rgba(30,41,59,0.9)", border: "1px solid rgba(100,116,139,0.4)", backdropFilter: "blur(8px)", borderRadius: 14, padding: 12, color: "#34d399", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s" }}
            >
              <HomeIcon />
         </motion.button>

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-100">
            Students <span className="text-emerald-400">Attendance</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm">Track and monitor student attendance records</p>
        </motion.div>

        {/* Stats Row — forced inline flex */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: "flex", gap: 16, marginBottom: 24 }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(30,41,59,0.6)",
                  border: "1px solid rgba(100,116,139,0.3)",
                  borderRadius: 16,
                  padding: "20px 16px",
                  textAlign: "center",
                }}
              >
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            backgroundColor: "rgba(30,41,59,0.5)",
            border: "1px solid rgba(100,116,139,0.3)",
            borderRadius: 20,
            overflow: "hidden",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(100,116,139,0.2)" }}>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ backgroundColor: "rgba(15,23,42,0.8)", border: "1px solid rgba(100,116,139,0.4)", borderRadius: 10, padding: "8px 16px", fontSize: 13, color: "#e2e8f0", width: 280, outline: "none" }}
              
            />
            <button
              onClick={loadStudents}
              style={{ fontSize: 12, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
              onMouseOver={(e) => e.target.style.color = "#34d399"}
              onMouseOut={(e) => e.target.style.color = "#64748b"}
            >
              ↻ Refresh
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ margin: "16px 20px", padding: "12px 16px", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#f87171", fontSize: 13, textAlign: "center" }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(100,116,139,0.25)" }}>
                  {[
                    { label: "Name", key: "name" },
                    { label: "Email", key: "email" },
                    { label: "Total", key: "total_classes" },
                    { label: "Present", key: "present" },
                    { label: "Absent", key: "absent" },
                    { label: "Attendance", key: "percentage" },
                  ].map(({ label, key }) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}
                    >
                      {label}<SortIcon col={key} />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading
                  ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                  : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "64px 16px", textAlign: "center", color: "#64748b" }}>
                        {search ? "No students match your search." : "No students found."}
                      </td>
                    </tr>
                  )
                  : filtered.map((s, i) => {
                      const pct = parseFloat(s.percentage);
                      const colors = getAttendanceColor(pct);
                      return (
                        <motion.tr
                          key={s.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          style={{ borderBottom: "1px solid rgba(100,116,139,0.15)" }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(100,116,139,0.1)"}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <td style={{ padding: "14px 16px", color: "#f1f5f9", fontWeight: 500 }}>{s.name}</td>
                          <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{s.email}</td>
                          <td style={{ padding: "14px 16px", color: "#cbd5e1" }}>{s.total_classes}</td>
                          <td style={{ padding: "14px 16px", color: "#34d399", fontWeight: 600 }}>{s.present}</td>
                          <td style={{ padding: "14px 16px", color: "#f87171", fontWeight: 600 }}>{s.absent}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 72, height: 5, backgroundColor: "rgba(100,116,139,0.3)", borderRadius: 99, overflow: "hidden" }}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(pct, 100)}%` }}
                                  transition={{ delay: i * 0.04 + 0.2, duration: 0.6, ease: "easeOut" }}
                                  style={{ height: "100%", borderRadius: 99 }}
                                  className={colors.bar}
                                />
                              </div>
                              <span
                                style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, border: "1px solid" }}
                                className={colors.badge}
                              >
                                {pct}%
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(100,116,139,0.2)", fontSize: 11, color: "#475569" }}>
              Showing {filtered.length} of {students.length} student{students.length !== 1 ? "s" : ""}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}