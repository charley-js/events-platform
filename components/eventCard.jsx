import { React, useState } from "react";

export default function EventCard({ event }) {
  const [attendees, setAttendees] = useState(event.attendees);
  const userId = localStorage.getItem("userId");
  const eventId = event._id;

  function handleSignup() {
    if (!userId) {
      alert("Log in required");
      return;
    }
    if (attendees.includes(userId)) {
      alert("You are already signed up for this event");
      return;
    }
    fetch(`/api/event-signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, eventId }),
    }).then((res) => {
      if (res.ok) {
        setAttendees([...attendees, userId]);
        alert("Signed up for event");
      } else {
        alert("Failed to sign up for event");
      }
    });
  }

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Category: {event.category}</p>
      <p>{attendees.length} Attending</p>
      <p>Created on: {new Date(event.created_at).toLocaleDateString()}</p>
      <button onClick={handleSignup}>Sign up</button>
    </div>
  );
}
