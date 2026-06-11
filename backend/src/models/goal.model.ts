import mongoose, { Schema } from "mongoose";

export interface IGoal extends mongoose.Document {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  user: mongoose.Types.ObjectId;
}

const goalSchema = new Schema<IGoal>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0
    },
    currentAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    deadline: {
      type: Date
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

export const Goal = mongoose.model<IGoal>("Goal", goalSchema);
