import { useEffect, useState } from "react";
import api from "@/services/api";

export default function AttendanceView() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/attendance/student")
      .then(res => setRecords(res.data))
      .finally(() => setLoading(false));
  }, []);

  const totalDays = records.length;
  const presentDays = records.filter(r => r.status === "Present").length;

  const percentage =
    totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading attendance...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Attendance</h2>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl shadow bg-white">
          <p className="text-sm text-gray-500">Total Days</p>
          <p className="text-2xl font-bold">{totalDays}</p>
        </div>

        <div className="p-4 rounded-xl shadow bg-white">
          <p className="text-sm text-gray-500">Present</p>
          <p className="text-2xl font-bold text-green-600">{presentDays}</p>
        </div>

        <div className="p-4 rounded-xl shadow bg-white">
          <p className="text-sm text-gray-500">Attendance %</p>
          <p
            className={`text-2xl font-bold ${
              percentage >= 75
                ? "text-green-600"
                : percentage >= 50
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {percentage}%
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {records.length === 0 && (
        <p className="text-gray-500 text-center mt-6">
          No attendance records found
        </p>
      )}

      {/* TABLE (ONLY IF DATA EXISTS) */}
      {records.length > 0 && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td className="border p-2">{r.date}</td>
                <td className="border p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      r.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
