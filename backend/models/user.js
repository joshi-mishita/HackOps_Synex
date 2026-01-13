import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    hdfcAccount: {
      type: Boolean,
      default: false
    },
    hdfcAmount: {
      type: Number,
      default: 0
    },
    iciciAccount: {
      type: Boolean,
      default: false
    },
    iciciAmount: {
      type: Number,
      default: 0
    },
    transactions: [
      {
        date: {
          type: Date,
          required: true
        },
        bankName: {
          type: String,
          required: true
        },
        category: {
          type: String,
          required: true
        },
        amount: {
          type: Number,
          required: true
        },
        subscriptionName: {
          type: String,
          default: null
        }
      }
    ]
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);