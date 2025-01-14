import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export const connect = async () => {
  const uri = process.env.URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Succesfully connected to MongoDB 'event-platform'.");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB 'event-platform'.", error.message);
  }
};
