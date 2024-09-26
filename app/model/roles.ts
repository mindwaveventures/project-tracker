import { Schema, model, models } from "mongoose";

const RoleSchema = new Schema(
  {
    name: {
      type: String,
    },
    permission: {
      type: [String],
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const RoleModel = models.conatct_form || model("role", RoleSchema);

export default RoleModel;
