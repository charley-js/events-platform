import { connect } from "../../database/connection";
import { ObjectId } from "mongodb";
import * as yup from "yup";

const eventSchema = yup.object({
  title: yup.string().required("Event title is required"),
  description: yup.string().required("Event description is required"),
  date: yup.string().required("Event date is required"),
  category: yup.string().required("Event category is required"),
});

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const events = db.collection("events");
  const { method } = req;
  const { _id } = req.query;
  const body = req.body;

  try {
    if (method === "GET") {
      if (_id) {
        await getEvent(events, _id, res);
      } else {
        await getAllEvents(events, res);
      }
    } else if (method === "POST") {
      await postEvent(events, body, res);
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

async function postEvent(events, body, res) {
  try {
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Invalid event format" });
    }
    await eventSchema.validate(body);
    body.created_at = Date.now();
    const result = await events.insertOne(body);
    return res.status(201).json({
      message: `Event created successfully`,
      event: {
        id: result.insertedId,
        title: body.title,
        description: body.description,
        date: body.date,
        category: body.category_id,
        created: body.created_at,
      },
    });
  } catch (error) {
    console.error("Error posting event.", error.message);
    return res.status(500).json({ message: "Error posting event" });
  }
}
