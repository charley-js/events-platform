import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "@ui/provider";

export const Metadata = {
  title: "Events Platform",
  description: "Check out the latest events near you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <body>
          <Provider>{children}</Provider>
        </body>
      </GoogleOAuthProvider>
    </html>
  );
}
