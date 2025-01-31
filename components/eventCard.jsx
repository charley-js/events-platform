import { React, useState } from "react";

export default function EventCard({ event }) {
  const [attendees, setAttendees] = useState(event.attendees);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const eventId = event._id;

  function handleSignup() {
    if (!userId || !accessToken) {
      alert("Log in and Google authentication required");
      return;
    }
    if (attendees.includes(userId)) {
      alert("You are already signed up for this event");
      return;
    }
    fetch(`/api/event-signup`, {
      cache: "no-store",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, eventId, accessToken }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message === "Event added to Google Calendar") {
          setAttendees([...attendees, userId]);
          alert("Signed up and added to Google Calendar");
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
