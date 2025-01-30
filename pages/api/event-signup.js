import { connect } from "../../database/connection";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const users = db.collection("users");
  const events = db.collection("events");
  const { method } = req;
  const { userId, eventId } = req.body;

  try {
    if (method === "POST") {
      await eventSignup(userId, eventId, users, events, res);
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

async function eventSignup(userId, eventId, users, events, res) {
  try {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid ID format" });
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

    res.status(200).json({ message: "Successfully signed up for event" });
  } catch (error) {
    console.error("Error signing up for event", error.message);
    res.status(500).json({ message: "Error signing up for event" });
  }
}
