"use client";
import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isMod, setIsMod] = useState(null);

  useEffect(() => {
    setUsername(Cookies.get("username") || null);
    setUserId(Cookies.get("userId") || null);
    setIsMod(Cookies.get("isMod") || null);
  }, []);

  function login(username, userId, isMod) {
    Cookies.set("username", username, { expires: 7 });
    setUsername(username);
    Cookies.set("userId", userId, { expires: 7 });
    setUserId(userId);
    Cookies.set("isMod", isMod, { expires: 7 });
    setIsMod(isMod);
  }

  function logout() {
    Cookies.remove("username");
    setUsername(null);
    Cookies.remove("userId");
    setUserId(null);
    Cookies.remove("isMod");
    setIsMod(null);
  }

  return (
    <SessionContext.Provider value={{ username, userId, isMod, login, logout }}>{children}</SessionContext.Provider>
  );
}
