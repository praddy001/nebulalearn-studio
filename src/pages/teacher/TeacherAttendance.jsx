import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Attendance() {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/students")
      .then((res) => {
        setStudents(res.data);
        // Initialize attendance data for all students
        const initialData = {};
        res.data.forEach((student) => {
          initialData[student.id] = {
            status: "Present",
            selected: false,
          };
        });
        setAttendanceData(initialData);
      })
      .catch((err) => console.error("Failed to load students", err));
  }, []);

  // Handle individual checkbox
  const handleCheckbox = (studentId) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        selected: !prev[studentId].selected,
      },
    }));
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedData = {};
    students.forEach((student) => {
      updatedData[student.id] = {
        ...attendanceData[student.id],
        selected: newSelectAll,
      };
    });
    setAttendanceData(updatedData);
  };

  // Handle status change for individual student
  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: status,
      },
    }));
  };

  // Mark all as Present
  const markAllPresent = () => {
    const updatedData = {};
    students.forEach((student) => {
      updatedData[student.id] = {
        ...attendanceData[student.id],
        status: "Present",
      };
    });
    setAttendanceData(updatedData);
  };

  // Mark all as Absent
  const markAllAbsent = () => {
    const updatedData = {};
    students.forEach((student) => {
      updatedData[student.id] = {
        ...attendanceData[student.id],
        status: "Absent",
      };
    });
    setAttendanceData(updatedData);
  };

  // Submit attendance
  const submitAttendance = async () => {
    // Get only selected students
    const selectedRecords = students
      .filter((student) => attendanceData[student.id]?.selected)
      .map((student) => ({
        student_id: student.id,
        status: attendanceData[student.id].status,
      }));

    if (selectedRecords.length === 0) {
      alert("Please select at least one student");
      return;
    }

    if (!date) {
      alert("Please select a date");
      return;
    }

    try {
      setLoading(true);
      await api.post("/attendance/bulk", {
        date,
        records: selectedRecords,
      });

      alert(`Attendance marked successfully for ${selectedRecords.length} students`);
      
      // Reset selections
      const resetData = {};
      students.forEach((student) => {
        resetData[student.id] = {
          status: "Present",
          selected: false,
        };
      });
      setAttendanceData(resetData);
      setSelectAll(false);
      setDate("");
    } catch (err) {
      alert("Failed to mark attendance");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = students.filter(
    (student) => attendanceData[student.id]?.selected
  ).length;

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

      <div className="max-w-7xl w-full relative z-10">
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-8">
            Teacher Control Panel • Academic Year 2024-25
          </p>
        </motion.header>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-xl"
        >
          <div className="flex flex-wrap items-end gap-4">
            {/* Date Selector */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold uppercase tracking-wide text-emerald-400 mb-2">
                Session Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-background text-foreground border-input focus-visible:ring-emerald-500/40"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={markAllPresent}
                variant="outline"
                className="border-emerald-500/60 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 px-5 py-2.5 rounded-lg font-medium transition-all"
              >
                ✓ Mark All Present
              </Button>
              <Button
                onClick={markAllAbsent}
                variant="outline"
                className="border-emerald-500/60 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 px-5 py-2.5 rounded-lg font-medium transition-all"
              >
                ✗ Mark All Absent
              </Button>
              <Button
                onClick={submitAttendance}
                disabled={loading || selectedCount === 0 || !date}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-lg font-semibold shadow-md disabled:opacity-30 disabled:bg-slate-700 transition-all"
              >
                {loading
                  ? "Submitting..."
                  : `Submit Attendance (${selectedCount})`}
              </Button>
            </div>
          </div>

          {/* Info Bar */}
          <div className="mt-4 flex items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>Total Students: {students.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Selected: {selectedCount}</span>
            </div>
          </div>
        </motion.div>

        {/* Attendance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full border-collapse">
                {/* Table Header */}
                <thead className="bg-slate-900/60 sticky top-0 z-10">
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-4 text-left w-12">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-emerald-600 border-slate-600 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wide w-24">
                      Roll No
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wide">
                      Student Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 uppercase tracking-wide w-48">
                      Status
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                        No students found. Please add students to mark attendance.
                      </td>
                    </tr>
                  ) : (
                    students.map((student, index) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                          index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/50"
                        } ${
                          attendanceData[student.id]?.selected
                            ? "bg-emerald-500/5 hover:bg-emerald-500/10"
                            : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={attendanceData[student.id]?.selected || false}
                            onChange={() => handleCheckbox(student.id)}
                            className="w-5 h-5 text-emerald-600 border-slate-600 rounded focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>

                        {/* Roll Number */}
                        <td className="px-6 py-4 text-sm font-semibold text-slate-300">
                          {student.roll_no || student.rollNo || index + 1}
                        </td>

                        {/* Student Name */}
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {student.name}
                        </td>

                        {/* Status Dropdown */}
                        <td className="px-6 py-4">
                          <select
                            value={attendanceData[student.id]?.status || "Present"}
                            onChange={(e) =>
                              handleStatusChange(student.id, e.target.value)
                            }
                            className={`w-full px-4 py-2 rounded-lg border-2 text-sm font-semibold cursor-pointer transition-all focus:outline-none focus:ring-2 ${
                              attendanceData[student.id]?.status === "Present"
                                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 focus:ring-emerald-500/50 hover:bg-emerald-500/20"
                                : "border-red-500/50 bg-emerald-500/10 text-emerald-400 focus:ring-emerald-500/50 hover:bg-emerald-500/20"
                            }`}
                          >
                            <option value="Present">✓ Present</option>
                            <option value="Absent">✗ Absent</option>
                          </select>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center mt-8 text-slate-500 text-[10px] uppercase tracking-widest">
          Secure Academic Record Entry System • Powered by Modern Education Platform
        </p>
      </div>
    </div>
  );
}