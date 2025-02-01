import { connect } from "../../database/connection";
import { ObjectId } from "mongodb";
import * as yup from "yup";

const eventSchema = yup.object({
  title: yup.string().required("Event title is required"),
  description: yup.string().required("Event description is required"),
  date: yup.string().required("Event date is required"),
  category: yup.string().required("Event category is required"),
});

const eventUpdateSchema = yup.object({
  title: yup.string(),
  description: yup.string(),
  date: yup.string(),
  category: yup.string(),
  attendees: yup.string(),
});

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const events = db.collection("events");
  const { method } = req;
  const { _id, category, userId } = req.query;
  const body = req.body;

  try {
    if (method === "GET") {
      if (_id) {
        await getEvent(events, _id, res);
      } else if (category) {
        await getEventsByCategory(events, category, res);
      } else if (userId) {
        await getEventsByUser(events, userId, res);
      } else {
        await getAllEvents(events, res);
      }
    } else if (method === "POST") {
      await postEvent(events, body, res);
    } else if (method === "PATCH") {
      await patchEvent(events, _id, body, res);
    } else if (method === "DELETE") {
      await deleteEvent(events, _id, res);
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
    body.attendees = [];
    const result = await events.insertOne(body);
    return res.status(201).json({
      message: `Event created successfully`,
      event: {
        id: result.insertedId,
        title: body.title,
        description: body.description,
        date: body.date,
        category: body.category,
        created: body.created_at,
      },
    });
  } catch (error) {
    console.error("Error posting event.", error.message);
    return res.status(500).json({ message: "Error posting event" });
  }
}

async function patchEvent(events, _id, body, res) {
  try {
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Invalid event format" });
    }
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    await eventUpdateSchema.validate(body);
    body.updated_at = Date.now();
    const result = await events.updateOne({ _id: new ObjectId(_id) }, { $set: body });
    return res.status(200).json({
      message: "Event updated successfully",
      event: {
        id: _id,
        ...body,
      },
    });
  } catch (error) {
    console.error("Error updating event.", error.message);
    return res.status(500).json({ message: "Error updating event" });
  }
}

async function deleteEvent(events, _id, res) {
  try {
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const result = await events.deleteOne({ _id: new ObjectId(_id) });
    return res.status(200).json({ message: "Event deleted succesfully" });
  } catch (error) {
    console.error("Error deleting event", error.message);
    return res.status(500).json({ message: "Error deleting event" });
  }
}

async function getEventsByCategory(events, category, res) {
  try {
    const result = await events.find({ category }).toArray();
    if (result.length === 0) {
      return res.status(404).json({ message: `No events found for ${category}` });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching events by category", error.message);
    res.status(500).json({ message: "Error fetching events by category" });
  }
}

async function getEventsByUser(events, userId, res) {
  try {
    const result = await events.find({ attendees: { $in: [new ObjectId(userId)] } }).toArray();
    if (result.length === 0) {
      console.log("No events found");
      return res.status(404).json({ message: `No events found for ${userId}` });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching events by user", error.message);
    res.status(500).json({ message: "Error fetching events by user" });
  }
}
