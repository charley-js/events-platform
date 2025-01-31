import { connect } from "../../database/connection";
import bcrypt from "bcrypt";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
);

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const users = db.collection("users");
  const { username, password, googleToken } = req.body;

  try {
    if (!username || !password || !googleToken) {
      return res.status(400).json({ message: "Username, password and Google authentication required" });
    }
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Incorrect username or password" });
    }
    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = await oauth2Client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    const payload = token.getPayload();
    if (!payload || user.googleId !== payload.sub) {
      return res.status(401).json({ message: "Google authentication failed" });
    }
    return res
      .status(200)
      .json({ message: "Authentication successful", userId: user._id.toString(), googleToken: googleToken.toString() });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.close();
  }
}
