import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  timezone: { type: String, default: "America/Argentina/Buenos_Aires" },
  createdAt: { type: Date, default: Date.now },
  country: { type: String },
  counters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Counter" }]
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
