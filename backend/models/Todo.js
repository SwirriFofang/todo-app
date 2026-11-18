import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Todo title is required"],
      trim: true,
      maxlength: [60, "Title cannot be more than 60 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [250, "Description cannot be more than 250 characters"],
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    priority: {
      type: String,
      //is a special data type used to define a set of named constants
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
  //Timestamps are usually presented in a consistent format, allowing for easy comparison of multiple records and the tracking progress over time; the practice of recording 
  // timestamps in a consistent manner along with the actual data is called timestamping.
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;