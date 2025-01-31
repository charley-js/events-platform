"use client";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => {
      console.log("OAuth Access Token:", res.access_token);
      setAccessToken(res.access_token);
    },
    onError: (error) => {
      console.error("Google login failed:", error);
      alert("Google login failed");
    },
    scope: "https://www.googleapis.com/auth/calendar",
  });

  function handleSubmit(event) {
    event.preventDefault();
    const details = { username, password, accessToken };
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
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("isMod", data.isMod);
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
          <button type="button" onClick={() => googleLogin()}>
            Sign in with Google
          </button>
          <button type="submit" disabled={!accessToken}>
            Log In
          </button>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
}
