import { connect } from "../../database/connection";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const client = await connect();
  const db = client.db();
  const users = db.collection("users");
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      userId: user._id.toString(),
      isMod: user.isMod,
      username: username,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.close();
  }
}
