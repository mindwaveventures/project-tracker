import mongoose, { Schema, model, models } from "mongoose";

const RoleSchema = new Schema(
  {
    name: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    permission: {
      type: [String],
      default: null
    },
    status: {
      type: String,
      default: 'active', // Set default value to 'active' and 'inactive'
    },
  },
  { timestamps: true }
);

const RoleModel = models.role || model("role", RoleSchema);

export default RoleModel;
