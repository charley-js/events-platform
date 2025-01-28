"use client";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const details = { username, password };
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message === "Authentication successful") {
          alert("Logged in succesfully");
        } else {
          alert("Error during login");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }

  return (
    <div>
      <h2>Welcome!</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          value={username}
          placeholder="Username..."
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          value={password}
          placeholder="Password..."
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
