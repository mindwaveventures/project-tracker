import { connectToMongoDB } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import ProjectModel from "@/app/model/projects";
import { z } from "zod";
import TaskModel from "@/app/model/task";

const projectValidationSchema = z.object({
  name: z.string().min(3).max(100),
  assigners: z
    .array(z.string().min(3).max(200)) // Array of strings with length constraints
    .min(1, { message: "At least one assigner is required" }), // Minimum 1 element in array
  tags: z
    .array(z.string().min(3).max(100)) // Array of strings with length constraints
    .min(1, { message: "At least one tag is required" }), // Minimum 1 element in array
  status: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url); // Create a URL object from the request URL
  const queryParams = url.searchParams; // Get query parameters
  const include = queryParams.get("include"); // Extract specific query parameters
  const project_id = queryParams.get("project_id"); // Extract specific query parameters

  await connectToMongoDB();

  if (include && include === "task" && project_id) {
    const taskCount = await TaskModel.countDocuments({ project: project_id });
    const taskDetails = await TaskModel.find({ project: project_id })
      .populate("assigners", "name image_url")
      .populate("created_by", "name image_url");
    const projectDetail = await ProjectModel.findOne({ _id: project_id }).populate('assigners', 'name image_url');
    return NextResponse.json({
      result: {
        tasks: taskDetails,
        taskCount,
        project: projectDetail
      },
    });
  } else {
    const result = await ProjectModel.find({})
      .populate("assigners", "name image_url")
      .lean();
    return NextResponse.json({
      result: result.map((data) => ({
        ...data,
        taskCount: Math.floor(Math.random() * 100),
      })),
    });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const validation: any = projectValidationSchema.safeParse(payload);

  await connectToMongoDB();
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const saveData = await ProjectModel.create(validation.data);

  if (saveData) {
    return NextResponse.json({ result: saveData }, { status: 201 });
  } else {
    return NextResponse.json(
      { msg: "Database connection error" },
      { status: 400 }
    );
  }
}
