import { connect } from "../../database/connection";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const events = db.collection("events");
  const { method } = req;
  const { _id } = req.query;

  try {
    if (method === "GET") {
      if (_id) {
        await getEvent(events, _id, res);
      } else {
        await getAllEvents(events, res);
      }
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

async function getEvent(events, _id, res) {
  try {
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const event = await events.findOne({ _id: new ObjectId(_id) });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event: ", error.message);
    res.status(500).json({ message: "Error fetching event" });
  }
}
