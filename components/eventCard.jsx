import React from "react";

export default function EventCard({ event }) {
  console.log(event.attendees);
  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Category: {event.category}</p>
      <p>{event.attendees.length} Attending</p>
      <p>Created on: {new Date(event.created_at).toLocaleDateString()}</p>
    </div>
  );
}
