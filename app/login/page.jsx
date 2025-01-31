"use client";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [googleToken, setGoogleToken] = useState("");

  function handleGoogleSuccess(res) {
    setGoogleToken(res.credential);
  }

  function handleGoogleFailure(error) {
    console.error(error);
    alert("Google authentication failed.");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const details = { username, password, googleToken };
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
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("googleToken", data.googleToken);
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
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
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
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
          <button type="submit" disabled={!googleToken}>
            Log In
          </button>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
}
