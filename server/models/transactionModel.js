import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  plan: {
    type: String,
    required: true,
    enum: ["Basic", "Advanced", "Business"],
  },
  amount: {
    type: Number,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  payment: {
    type: Boolean,
    default: false,
  },
  razorpay_order_id: {
    type: String, // ✅ added to link Razorpay order with this transaction
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const transactionModel =
  mongoose.models.transaction || mongoose.model("transaction", transactionSchema);

export default transactionModel;
