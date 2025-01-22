import { connect } from "../../database/connection";

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const categories = db.collection("categories");
  const { method } = req;

  try {
    if (method === "GET") {
      await getAllCategories(categories, res);
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

async function getAllCategories(categories, res) {
  try {
    const result = await categories.find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching categories", error.message);
    res.status(500).json({ message: "Error fetching categories" });
  }
}
