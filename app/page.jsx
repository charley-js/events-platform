"use client";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    if (!userId || !accessToken) {
      router.push("/login");
      return;
    }
    fetch(`/api/users?_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => router.push("/login"));

    fetch(`/api/events?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>

      <h2>Your Events</h2>
      <ul>
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event._id}>
              <h2>{event.title}</h2>
              <strong>{event.category}</strong>
              <p>{event.description}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.attendees.length} Attending</p>
            </li>
          ))
        ) : (
          <p>Empty.</p>
        )}
      </ul>
    </div>
  );
}
