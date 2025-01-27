import { connect } from "../../database/connection.js";
import { ObjectId } from "mongodb";
import * as yup from "yup";
import bcrypt from "bcrypt";

const userSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&]/, "Password must contain at least one special character")
    .required("Password is required"),
  isMod: yup.boolean().required("isMod is required"),
});

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const users = db.collection("users");
  const { method } = req;
  const { _id } = req.query;
  const body = req.body;

  try {
    if (method === "GET") {
      if (_id) {
        await getUser(_id, users, res);
      } else {
        await getAllUsers(users, res);
      }
    } else if (method === "POST") {
      await postUser(users, body, res);
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

async function postUser(users, body, res) {
  try {
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Invalid user format" });
    }
    await userSchema.validate(body);
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
    const result = await users.insertOne(body);
    return res.status(201).json({
      message: `User created successfully`,
      user: { id: result.insertedId, username: body.username, email: body.email, isMod: body.isMod },
    });
  } catch (error) {
    console.error("Error posting user.", error.message);
    return res.status(500).json({ message: "Error posting user" });
  }
}
