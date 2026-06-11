import mongoose, { Schema } from "mongoose";

export interface IBudget extends mongoose.Document {
  amount: number;
  month: number;
  year: number;
  user: mongoose.Types.ObjectId;
}

const budgetSchema = new Schema<IBudget>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Budget = mongoose.model<IBudget>("Budget", budgetSchema);
