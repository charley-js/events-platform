import { connect } from "../../database/connection";
import { ObjectId } from "mongodb";
import { google } from "googleapis";

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const users = db.collection("users");
  const events = db.collection("events");
  const { method } = req;
  const { userId, eventId, accessToken } = req.body;

  try {
    if (method === "POST") {
      await eventSignup(userId, eventId, accessToken, users, events, res);
    } else {
      res.status(405).json({ message: "Invalid method" });
    }
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.close();
  }
}

async function eventSignup(userId, eventId, accessToken, users, events, res) {
  try {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(eventId) || !accessToken) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const event = await events.findOne({ _id: new ObjectId(eventId) });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (user.events.includes(eventId)) {
      return res.status(400).json({ message: "Already signed up for event" });
    }

    await users.updateOne({ _id: new ObjectId(userId) }, { $push: { events: new ObjectId(eventId) } });
    await events.updateOne({ _id: new ObjectId(eventId) }, { $push: { attendees: new ObjectId(userId) } });
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: accessToken });

    try {
      const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
    } catch (error) {
      console.error("Invalid Google Token:", error.message);
      return res.status(400).json({ message: "Invalid Google Token" });
    }

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const googleEvent = {
      summary: event.title,
      description: event.description,
      start: { dateTime: new Date(event.date).toISOString(), timeZone: "UTC" },
      end: { dateTime: new Date(event.date).toISOString(), timeZone: "UTC" },
      attendees: [{ email: user.email }],
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: googleEvent,
    });

    return res.status(200).json({ message: "Event added to Google Calendar" });
  } catch (error) {
    console.error("Error signing up for event", error.message);
    res.status(500).json({ message: "Error signing up for event" });
  }
}
