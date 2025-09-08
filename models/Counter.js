import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  //creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  //creatorName: { type: String, required: true },
  name: { type: String, required: true },
  endTime: { type: Date, required: true },
  timezone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Counter || mongoose.model("Counter", CounterSchema);
