import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const Metadata = {
  title: "Events Platform",
  description: "Check out the latest events near you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <body>{children}</body>
      </GoogleOAuthProvider>
    </html>
  );
}
