import { connect } from "../../database/connection";
import bcrypt from "bcryptjs";
import { google } from "googleapis";

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const users = db.collection("users");
  const { username, password, accessToken } = req.body;

  try {
    if (!username || !password || !accessToken) {
      return res.status(400).json({ message: "Username, password and Google authentication required" });
    }
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const googleUserInfo = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const googleUser = await googleUserInfo.json();

    if (!googleUser || googleUser.id !== user.googleId) {
      return res.status(401).json({ message: "Google authentication failed" });
    }

    return res.status(200).json({
      message: "Authentication successful",
      userId: user._id.toString(),
      isMod: user.isMod,
      accessToken: accessToken,
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.close();
  }
}
