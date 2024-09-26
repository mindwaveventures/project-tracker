import mongoose, { Schema, model, models } from "mongoose";

const TaskerSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: 'active', // Set default value to 'active' and 'inactive'
    },
    start_end: {
      type: Date,
      default: null,
    },
    end_date: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
    },
    assigners: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      default: null, // Allows assigners to be null
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
  },
  { timestamps: true }
);

const TaskModel = models.task || model("task", TaskerSchema);

export default TaskModel;
