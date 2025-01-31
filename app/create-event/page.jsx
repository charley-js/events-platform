"use client";

import { React, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const router = useRouter();

  function handleEventCreate(event) {
    event.preventDefault();
    const newEvent = {
      title: eventTitle,
      description: eventDescription,
      date: eventDate,
      category: eventCategory,
    };
    fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Event created successfully") {
          alert("Event created successfully!");
          router.push("/events");
        } else {
          alert("Error creating event");
        }
      })
      .catch((err) => {
        console.error("Error creating event:", err);
        alert("Error creating event");
      });
  }

  return (
    <div>
      <h1>Create Event</h1>
      <form onSubmit={handleEventCreate}>
        <div>
          <label>Title:</label>
          <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} required />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
