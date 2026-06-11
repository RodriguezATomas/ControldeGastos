import mongoose, { Schema } from "mongoose";

export interface IExpense extends mongoose.Document {
  description: string;
  amount: number;
  date: Date;
  category: mongoose.Types.ObjectId;
  paymentMethod: string;
  user: mongoose.Types.ObjectId;
}

const expenseSchema = new Schema<IExpense>(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true
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

export const Expense = mongoose.model<IExpense>("Expense", expenseSchema);
