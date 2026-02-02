import { useEffect, useState } from "react";
import api from "@/services/api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/events")
      .then(res => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading events...
      </div>
    );
  }

  // 🔹 Empty state
  if (events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No events posted yet
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {events.map((e, i) => (
        <div key={i} className="p-5 bg-white rounded-xl shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{e.title}</h3>
            <span className="text-sm text-gray-500">{e.date}</span>
          </div>
          <p className="mt-2 text-gray-700">{e.description}</p>
        </div>
      ))}
    </div>
  );
}
