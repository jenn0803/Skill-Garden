import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;
const SALT_ROUNDS = 10;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  authProvider: { type: String, enum: ["email", "google"], default: "email" },
  totalXP: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  completedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  achievements: [{ type: String }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profileImage: { type: String },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export default model("User", userSchema);
