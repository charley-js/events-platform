import { connect } from "../../database/connection";
import { google } from "googleapis";
import * as yup from "yup";
import bcrypt from "bcrypt";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

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
  googleToken: yup.string().required("Google authentication required"),
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
    const { tokens } = await oauth2Client.getToken(body.googleToken);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    body.googleId = data.id;
    body.googleTokens = tokens;
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
