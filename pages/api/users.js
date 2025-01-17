import { connect } from "../../database/connection.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const users = db.collection("users");
  const { method } = req;
  const { _id } = req.query;

  try {
    if (method === "GET") {
      if (_id) {
        await getUser(_id, users, res);
      } else {
        await getAllUsers(users, res);
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

async function getAllUsers(users, res) {
  try {
    const allUsers = await users.find().toArray();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users.", error.message);
    res.status(500).json({ message: "Error fetching users." });
  }
}

async function getUser(_id, users, res) {
  try {
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const user = await users.findOne({ _id: new ObjectId(_id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user: ", error.message);
    res.status(500).json({ message: "Error fetching user" });
  }
}
