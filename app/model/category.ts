import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
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
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
  },
  { timestamps: true }
);

const CategoryModel = models.category || model("category", CategorySchema);

export default CategoryModel;
