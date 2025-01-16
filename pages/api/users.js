import { connect } from "../../database/connection.js";

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  if (req.method === "GET") {
    try {
      const users = await db.collection("users").find().toArray();
      res.status(200).json(users);
    } catch (error) {
      console.log("Error fetching users: ", error.message);
      res.status(500).json({ message: "Error fetching users" });
    }
  }
}
