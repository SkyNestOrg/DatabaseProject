import bcrypt from "bcrypt";
import db from "./db/connection.js";

const hashPasswords = async () => {
  const [rows] = await db.query("SELECT username, password FROM Staff_User");

  for (const user of rows) {
    // only re-hash if it's not already a bcrypt hash
    if (!user.password.startsWith("$2b$")) {
      const hashed = await bcrypt.hash(user.password, 10);
      await db.query("UPDATE Staff_User SET password = ? WHERE username = ?", [hashed, user.username]);
      console.log(`Updated ${user.username}`);
    }
  }

  console.log("All plain-text passwords hashed ✅");
  process.exit();
};

hashPasswords();
