import { useState } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PostEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const postEvent = async () => {
    await api.post("/events", {
      title,
      description,
      date,
      created_by: 1, // staff id
    });
    alert("Event posted");
  };

  return (
    <div className="p-6 max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Post Event</h2>

      <Input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <Input type="date" onChange={(e) => setDate(e.target.value)} />
      <textarea
        className="border rounded p-2 w-full"
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button onClick={postEvent}>Post</Button>
    </div>
  );
}
