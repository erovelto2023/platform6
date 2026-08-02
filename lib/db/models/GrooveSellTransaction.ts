import { Schema, model, models } from "mongoose";

const GrooveSellTransactionSchema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
      index: true,
    },
    event: {
      type: String,
      required: true,
      enum: ["PURCHASE", "purchase.completed", "rebill", "REFUND", "refund", "CANCEL", "subscription.cancelled", "subscription.failed"],
    },
    buyerEmail: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    buyerName: {
      type: String,
    },
    productId: {
      type: String,
      required: true,
      index: true,
    },
    productName: {
      type: String,
    },
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["completed", "refunded", "cancelled", "failed"],
      default: "completed",
    },
    rawPayload: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const GrooveSellTransaction =
  models.GrooveSellTransaction || model("GrooveSellTransaction", GrooveSellTransactionSchema);

export default GrooveSellTransaction;
