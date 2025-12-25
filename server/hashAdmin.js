// hashAdmin.js
import bcrypt from "bcryptjs";

const run = async () => {
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hash);
};

run();
