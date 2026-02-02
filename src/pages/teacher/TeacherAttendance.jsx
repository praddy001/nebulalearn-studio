import { useState, useEffect } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Attendance() {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");

  // ✅ Load students for teacher
  useEffect(() => {
    api
      .get("/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Failed to load students", err));
  }, []);

  const submitAttendance = async () => {
    try {
      setLoading(true);

      await api.post("/attendance", {
        student_id: studentId,
        date,
        status,
      });

      alert("Attendance marked successfully");
      setStudentId("");
      setDate("");
      setStatus("Present");
    } catch (err) {
      console.error(err);
      alert("Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Mark Attendance</h2>

      {/* ✅ STUDENT DROPDOWN (REPLACED INPUT) */}
      <select
        className="border p-2 rounded w-full"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        required
      >
        <option value="">Select Student</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </select>

      {/* DATE */}
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* STATUS */}
      <select
        className="border p-2 rounded w-full"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
      </select>

      {/* SUBMIT */}
      <Button
        onClick={submitAttendance}
        disabled={loading || !studentId || !date}
      >
        {loading ? "Submitting..." : "Submit Attendance"}
      </Button>
    </div>
  );
}
