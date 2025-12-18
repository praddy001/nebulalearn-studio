import { useEffect, useState } from "react";

interface Note {
  id: number;
  filename: string;
  size: number;
  uploaded_at: string;
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch notes list
  // -----------------------------
  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Not authenticated");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/files/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          alert("Failed to fetch notes");
          return;
        }

        const data = await res.json();
        setNotes(data);
      } catch (err) {
        alert("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // -----------------------------
  // Download file securely
  // -----------------------------
  const downloadFile = async (fileId: number, filename: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/files/${fileId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        alert("Download failed");
        return;
      }

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
      alert("Server error");
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading notes...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Available Notes</h2>

      {notes.length === 0 ? (
        <p>No notes uploaded yet.</p>
      ) : (
        <table
          border={1}
          cellPadding={10}
          style={{ marginTop: "1rem", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Filename</th>
              <th>Size (KB)</th>
              <th>Uploaded At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td>{note.filename}</td>
                <td>{Math.round(note.size / 1024)}</td>
                <td>
                  {new Date(note.uploaded_at).toLocaleString()}
                </td>
                <td>
                  <button
                    onClick={() =>
                      downloadFile(note.id, note.filename)
                    }
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
