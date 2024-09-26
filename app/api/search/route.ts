import { connectToMongoDB } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import UserModel from "@/app/model/users";
import { z } from "zod";
import TaskModel from "@/app/model/task";
import ProjectModel from "@/app/model/projects";
import CategoryModel from "@/app/model/category";
import RoleModel from "@/app/model/roles";

// Define the allowed values for contactText
const allowedModule = ["task", "user", "project", "category", "role"] as const;

const userValidationSchema = z.object({
  identifier: z.string().min(2).max(100),
  module: z.enum(allowedModule),
});

const dropDownFormatter = (arr: Array<any>, key: string, value: string) =>
  arr.map((a: any) => ({ label: a[key], value: a[value] }));

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Retrieve query parameters from the request
  const url = new URL(request.url); // Create a URL object from the request URL
  const queryParams = url.searchParams; // Get query parameters
  const dropdown = queryParams.get('dropdown');  // Extract specific query parameters

  const payload = await request.json();

  const validation: any = userValidationSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  await connectToMongoDB();

  const searchKey = validation.data.identifier;

  // User search Module
  if (validation.data.module === allowedModule[1]) {
    const result = await UserModel.find({
      $or: [
        { name: { $regex: searchKey, $options: "i" } },
        { email: { $regex: searchKey, $options: "i" } },
      ],
    });

    return NextResponse.json({
      result: dropdown ? dropDownFormatter(result, 'name', '_id') : result,
    });
  }
  // task search Module
  if (validation.data.module === allowedModule[0]) {
    const result = await TaskModel.find({
      $or: [
        { name: { $regex: searchKey, $options: "i" } },
        { description: { $regex: searchKey, $options: "i" } },
      ],
    });

    return NextResponse.json({
      result: dropdown ? dropDownFormatter(result, 'name', '_id') : result,
    });
  }
  // Project search Module
  if (validation.data.module === allowedModule[2]) {
    const result = await ProjectModel.find({
      $or: [{ name: { $regex: searchKey, $options: "i" } }],
    });

    return NextResponse.json({
      result: dropdown ? dropDownFormatter(result, 'name', '_id') : result,
    });
  }
  // category search Module
  if (validation.data.module === allowedModule[3]) {
    const result = await CategoryModel.find({
      $or: [{ name: { $regex: searchKey, $options: "i" } }],
    });

    return NextResponse.json({
      result: dropdown ? dropDownFormatter(result, 'name', '_id') : result,
    });
  }
  // role search Module
  if (validation.data.module === allowedModule[4]) {
    const result = await RoleModel.find({
      $or: [{ name: { $regex: searchKey, $options: "i" } }],
    });

    return NextResponse.json({
      result: dropdown ? dropDownFormatter(result, 'name', '_id') : result,
    });
  }
}
