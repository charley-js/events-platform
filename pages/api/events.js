import { connect } from "../../database/connection";

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const events = db.collection("events");
  const { method } = req;

  try {
    if (method === "GET") {
      await getAllEvents(events, res);
    } else {
      res.status(405).json({ message: "Invalid method" });
    }
  } catch (error) {
    console.error("API Error: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.close();
  }
}

async function getAllEvents(events, res) {
  try {
    const allEvents = await events.find().toArray();
    res.status(200).json(allEvents);
  } catch (error) {
    console.error("Error fetching events.", error.message);
    res.status(500).json({ message: "Error fetching events." });
  }
}
