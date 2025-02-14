"use client";
import React from "react";
import { Provider } from "../components/ui/provider";
import NavBar from "../components/NavBar";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const Metadata = {
  title: "Events Platform",
  description: "Check out the latest events near you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <Provider>
            <NavBar />
            <main>{children}</main>
          </Provider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
