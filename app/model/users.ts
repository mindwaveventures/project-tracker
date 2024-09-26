import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    image_url: {
      type: String,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'role'
    },
    status: {
      type: String,
    },
    created_on: {
      type: String,
    },
    last_logged: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel = models.conatct_form || model("user", UserSchema);

export default UserModel;
