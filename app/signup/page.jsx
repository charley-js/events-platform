"use client";
import { React, useState } from "react";
import * as yup from "yup";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const userSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&]/, "Password must contain at least one special character")
    .required("Password is required"),
  googleToken: yup.string().required("Google authentication required"),
});

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleToken, setGoogleToken] = useState("");
  const [errors, setErrors] = useState({ username: "", email: "", password: "" });

  function handleGoogleSuccess(res) {
    setGoogleToken(res.credential);
  }

  function handleGoogleFailure(error) {
    console.error(error);
    alert("Google authentication failed.");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const user = { username, email, password, events: [], googleToken, isMod: false };

    return userSchema
      .validate(user, { abortEarly: false })
      .then(() => {
        setErrors({ username: "", email: "", password: "" });
        return fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message === "User created successfully") {
          alert("Sign up successful");
        } else {
          alert("Error during Sign up");
        }
      })
      .catch((err) => {
        if (!err.inner) {
          console.error("Error:", err);
        } else {
          const validationErrors = {};
          err.inner.forEach((error) => {
            validationErrors[error.path] = error.message;
          });
          setErrors(validationErrors);
        }
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
          {errors.username && <p>{errors.username}</p>}
          <label htmlFor="email">Email : </label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Email Address..."
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          {errors.email && <p>{errors.email}</p>}
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Password..."
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {errors.password && <p>{errors.password}</p>}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          />
          <button type="submit" disabled={!googleToken}>
            Sign Up
          </button>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
}
