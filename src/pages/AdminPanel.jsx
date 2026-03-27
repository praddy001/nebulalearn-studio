import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const token = () => localStorage.getItem("token");

const ROLE_CONFIG = {
  admin:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.3)",   dot: "#f59e0b" },
  teacher: { color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.3)",   dot: "#34d399" },
  student: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)",   border: "rgba(96,165,250,0.3)",   dot: "#60a5fa" },
};

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`,
      borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700,
      color: cfg.color, textTransform: "capitalize",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: cfg.dot, boxShadow: `0 0 5px ${cfg.dot}` }} />
      {role}
    </span>
  );
};

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2 7-7 7 7 2 2M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0v-4a1 1 0 011-1h2a1 1 0 011 1v4" />
  </svg>
);

export default function AdminPanel() {
  const [users, setUsers]       = useState([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");
  const [success, setSuccess]   = useState(null);
  const [error, setError]       = useState(null);
  const [changing, setChanging] = useState(null); // userId being updated
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: "Bearer " + token() },
    })
      .then((r) => r.json())
      .then((user) => { if (user.role !== "admin") navigate("/dashboard"); })
      .catch(() => navigate("/dashboard"));
  }, []);

  // Load users
  useEffect(() => {
    setFetching(true);
    fetch("http://localhost:5000/api/auth/users", {
      headers: { Authorization: "Bearer " + token() },
    })
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load users."))
      .finally(() => setFetching(false));
  }, []);

  const changeRole = async (userId, newRole) => {
    setChanging(userId);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/change-role/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token() },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
      setSuccess(data.message || "Role updated successfully.");
      setTimeout(() => setSuccess(null), 3500);
    } catch (e) {
      setError(e.message || "Failed to update role.");
    } finally {
      setChanging(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
                        u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  const counts = { all: users.length, admin: 0, teacher: 0, student: 0 };
  users.forEach((u) => { if (counts[u.role] !== undefined) counts[u.role]++; });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1e", padding: "48px 24px", color: "#e2e8f0", position: "relative", overflow: "hidden" }}>

      {/* BG */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(16,185,129,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.03) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "fixed", top: -80, right: -80, width: 480, height: 480, background: "radial-gradient(circle,rgba(245,158,11,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, left: -80, width: 380, height: 380, background: "radial-gradient(circle,rgba(96,165,250,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

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
            System Administration
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", margin: 0 }}>
            Admin <span style={{ color: "#f59e0b" }}>Panel</span>
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

        {/* Stats + Filters */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ backgroundColor: "rgba(30,41,59,0.6)", border: "1px solid rgba(100,116,139,0.25)", borderRadius: 20, padding: 20, marginBottom: 16, backdropFilter: "blur(12px)" }}>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            {/* Role filter tabs */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { key: "all",     label: "All",     color: "#94a3b8" },
                { key: "admin",   label: "Admins",  color: "#f59e0b" },
                { key: "teacher", label: "Teachers",color: "#34d399" },
                { key: "student", label: "Students",color: "#60a5fa" },
              ].map(({ key, label, color }) => (
                <button key={key} onClick={() => setFilter(key)}
                  style={{
                    padding: "7px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                    border: `1px solid ${filter === key ? color + "60" : "rgba(100,116,139,0.25)"}`,
                    backgroundColor: filter === key ? color + "15" : "transparent",
                    color: filter === key ? color : "#64748b",
                  }}
                >
                  {label} <span style={{ opacity: 0.7 }}>({counts[key]})</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ backgroundColor: "rgba(15,23,42,0.8)", border: "1px solid rgba(100,116,139,0.35)", borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "#e2e8f0", outline: "none", width: 260, boxSizing: "border-box" }}
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ backgroundColor: "rgba(30,41,59,0.5)", border: "1px solid rgba(100,116,139,0.25)", borderRadius: 20, overflow: "hidden", backdropFilter: "blur(12px)" }}>

          <div style={{ overflowX: "auto", maxHeight: 560, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "rgba(15,23,42,0.97)", backdropFilter: "blur(8px)" }}>
                <tr style={{ borderBottom: "1px solid rgba(100,116,139,0.25)" }}>
                  {["#", "Name", "Email", "Current Role", "Change Role"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748b" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fetching ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(100,116,139,0.12)" }}>
                      {[30, 140, 200, 90, 130].map((w, j) => (
                        <td key={j} style={{ padding: "16px" }}>
                          <div style={{ height: 13, width: w, backgroundColor: "rgba(100,116,139,0.2)", borderRadius: 6 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "60px 16px", textAlign: "center", color: "#475569" }}>
                      {search ? "No users match your search." : "No users found."}
                    </td>
                  </tr>
                ) : filtered.map((user, i) => (
                  <motion.tr key={user.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: "1px solid rgba(100,116,139,0.12)", transition: "background-color 0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(100,116,139,0.08)"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "14px 16px", color: "#475569", fontWeight: 600 }}>
                      {user.id}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#f1f5f9", fontWeight: 600 }}>
                      {user.name}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#94a3b8" }}>
                      {user.email}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <RoleBadge role={user.role} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {changing === user.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 12 }}>
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{ display: "inline-block", width: 13, height: 13, border: "2px solid #34d399", borderTopColor: "transparent", borderRadius: "50%" }} />
                          Updating…
                        </div>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => changeRole(user.id, e.target.value)}
                          style={{
                            backgroundColor: "rgba(15,23,42,0.8)",
                            border: `1px solid ${ROLE_CONFIG[user.role]?.border || "rgba(100,116,139,0.4)"}`,
                            borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                            color: ROLE_CONFIG[user.role]?.color || "#e2e8f0",
                            cursor: "pointer", outline: "none",
                          }}
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {!fetching && filtered.length > 0 && (
            <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(100,116,139,0.2)", fontSize: 11, color: "#475569" }}>
              Showing {filtered.length} of {users.length} user{users.length !== 1 ? "s" : ""}
            </div>
          )}
        </motion.div>

        <p style={{ textAlign: "center", marginTop: 28, color: "#334155", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Secure Admin Control System · Role changes take effect immediately
        </p>
      </div>
    </div>
  );
}