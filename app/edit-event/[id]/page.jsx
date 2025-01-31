"use client";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id;

  const router = useRouter();
  const [eventInfo, setEventInfo] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
  });

  useEffect(() => {
    console.log("Event ID", eventId);
    fetch(`/api/events?_id=${eventId}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setEventInfo({
          title: data.title,
          description: data.description,
          date: data.date,
          category: data.category,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [eventId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setEventInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch(`/api/events?_id=${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Event updated successfully") {
          alert("Event updated successfully!");
          router.push(`/events`);
        } else {
          alert("Failed to update event.");
        }
      })
      .catch((err) => {
        console.error("Error updating event", err);
        alert("Error updating event.");
      });
  }

  return (
    <div>
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Title</label>
          <input type="text" name="title" value={eventInfo.title} onChange={handleChange} />
        </div>
        <div>
          <label>Event Description</label>
          <textarea name="description" value={eventInfo.description} onChange={handleChange} />
        </div>
        <div>
          <label>Event Date</label>
          <input type="datetime-local" name="date" value={eventInfo.date} onChange={handleChange} />
        </div>
        <div>
          <label>Category</label>
          <input type="text" name="category" value={eventInfo.category} onChange={handleChange} />
        </div>
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
}
