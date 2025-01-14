import { Metadata } from "next";
import React from "react";

export const metadata = {
  title: "",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
