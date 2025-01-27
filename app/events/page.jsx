"use client";
import { React, useState, useEffect } from "react";
import EventCard from "../../components/EventCard";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch("/api/events").then((res) => {
      return res.json().then((data) => {
        setEvents(data);
      });
    });
  }, []);

  return (
    <div>
      <h1>All Events</h1>
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
