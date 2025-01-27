import React from "react";

export const Metadata = {
  title: "Events Platform",
  description: "Check out the latest events near you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
