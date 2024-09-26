import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    color: {
      type: String,
      default: null, // Set default value to 'active' and 'inactive'
    },
    assigners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    tags: {
      type: [String],
    },
    status: {
      type: String,
      default: 'active', // Set default value to 'active' and 'inactive'
    },
  },
  { timestamps: true }
);

const ProjectModel = models.project || model("project", ProjectSchema);

export default ProjectModel;
