"use client";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "../components/ui/provider";
import NavBar from "../components/NavBar";
import dynamic from "next/dynamic";

// const Dashboard = dynamic(() => import("../app/page"), { ssr: false });
// const SignupPage = dynamic(() => import("../app/signup/page"), { ssr: false });
// const LoginPage = dynamic(() => import("../app/login/page"), { ssr: false });
// const CreateEventPage = dynamic(() => import("../app/create-event/page"), { ssr: false });
// const EditEventPage = dynamic(() => import("../app/edit-event/[id]/page"), { ssr: false });
// const EventDetailsPage = dynamic(() => import("../app/events/[id]/page"), { ssr: false });
// const EventsPage = dynamic(() => import("../app/events/page"), { ssr: false });

export const Metadata = {
  title: "Events Platform",
  description: "Check out the latest events near you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <body>
          <Provider>
            <NavBar />
            <main>{children}</main>
          </Provider>
        </body>
      </GoogleOAuthProvider>
    </html>
  );
}
