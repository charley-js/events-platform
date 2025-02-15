"use client";
import React from "react";
import { Provider } from "../components/ui/provider";
import NavBar from "../components/NavBar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SessionProvider } from "../context/SessionContext";

export const Metadata = {
  title: "Events Platform",
  description: "Check out the latest events near you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <SessionProvider>
            <Provider>
              <NavBar />
              <main>{children}</main>
            </Provider>
          </SessionProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
