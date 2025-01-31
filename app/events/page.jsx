"use client";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventCard from "../../components/EventCard";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isMod, setIsMod] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const userIsMod = localStorage.getItem("isMod");
    if (userIsMod === "true") {
      setIsMod(true);
    }
    fetch("/api/events").then((res) => {
      return res.json().then((data) => {
        setEvents(data);
      });
    });
  }, []);

  function handleCreateEvent() {
    router.push("/create-event");
  }

  return (
    <div>
      <h1>All Events</h1>
      {isMod && <button onClick={handleCreateEvent}>Create Event</button>}
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
