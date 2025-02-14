import { connect } from "../../database/connection";
import * as yup from "yup";
import bcrypt from "bcryptjs";

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
});

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const users = db.collection("users");
  const { method } = req;
  const body = req.body;

  try {
    if (method === "POST") {
      await signUp(users, body, res);
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

async function signUp(users, body, res) {
  try {
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Invalid user format" });
    }
    const user = await users.findOne({ username: body.username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
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
