import { useState } from "react";

export default function TeacherUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }

      alert("File uploaded successfully ✅");
      setFile(null);
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload Notes (Teacher)</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={uploadFile} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
