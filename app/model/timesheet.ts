import mongoose, { Schema, model, models } from "mongoose";

const TimeSheetSchema = new Schema(
  {
    description: {
      type: String,
    },
    status: {
      type: String,
      default: 'active', // Set default value to 'active' and 'inactive'
    },
    date: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'project'
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'task'
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
  },
  { timestamps: true }
);

const TimeSheetModel = models.timesheet || model("timesheet", TimeSheetSchema);

export default TimeSheetModel;
