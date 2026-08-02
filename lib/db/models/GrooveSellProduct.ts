import { Schema, model, models } from "mongoose";

const GrooveSellProductSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    productType: {
      type: String,
      enum: ["book", "app", "course", "template", "membership", "upsell"],
      default: "book",
    },
    price: {
      type: Number,
      default: 0,
    },
    grooveSellCheckoutUrl: {
      type: String,
    },
    accessUrl: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    badgeText: {
      type: String,
      default: "Digital Download",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const GrooveSellProduct =
  models.GrooveSellProduct || model("GrooveSellProduct", GrooveSellProductSchema);

export default GrooveSellProduct;
