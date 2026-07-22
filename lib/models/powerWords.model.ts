import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPowerWord {
  _id?: string;
  word: string;
  category: "urgency_scarcity" | "curiosity_mystery" | "ease_speed" | "trust_authority" | "exclusivity_belonging" | "value_gain" | "fear_pain";
  synonyms?: string[];
  examples?: string[];
  psychology: string;
  appUseCase: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PowerWordSchema = new Schema<IPowerWord>(
  {
    word: { type: String, required: true, unique: true },
    category: { 
      type: String, 
      enum: ["urgency_scarcity", "curiosity_mystery", "ease_speed", "trust_authority", "exclusivity_belonging", "value_gain", "fear_pain"],
      required: true 
    },
    synonyms: [{ type: String }],
    examples: [{ type: String }],
    psychology: { type: String, required: true },
    appUseCase: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PowerWord: Model<IPowerWord> = mongoose.models.PowerWord || mongoose.model<IPowerWord>("PowerWord", PowerWordSchema);

export { PowerWord };
