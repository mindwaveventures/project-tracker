import { connectToMongoDB } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import TaskModel from "@/app/model/task";
import ProjectModel from "@/app/model/projects";

function generateTaskId(prefix: string, taskNumber: number) {
  // Pad the task number with leading zeros to ensure it has 6 digits
  const paddedNumber = String(taskNumber).padStart(6, "0");
  // Concatenate the prefix with the padded number
  return `${prefix}-${paddedNumber}`;
}

const projectValidationSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(3).max(500).optional(),
  start_end: z.date().nullable().optional(),
  end_date: z.date().nullable().optional(),
  priority: z.string().optional(),
  project: z.string(),
  billing_type: z.string(),
  assigners: z
    .array(z.string().min(3).max(200)) // Array of strings with length constraints
    .min(1, { message: "At least one assigner is required" }), // Minimum 1 element in array
  status: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToMongoDB();
  const result = await TaskModel.find({})
    .populate("assigners", "name")
    .populate("project", "name");
  return NextResponse.json({
    result: result,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const validation = projectValidationSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  await connectToMongoDB();

  const { project } = validation.data;

  // Fetch project details and validate it
  const getProjectDetail = await ProjectModel.findOne({ _id: project });

  if (!getProjectDetail) {
    return NextResponse.json({ msg: "Project id is invalid" }, { status: 400 });
  }

  // Count the number of existing tasks for this project to generate task ID
  const getCount = await TaskModel.countDocuments({ project });

  // Create the new task with all required data
  const saveData = await TaskModel.create({
    ...validation.data,
    task_id: generateTaskId(getProjectDetail.code, getCount + 1),
    created_by: session?.user?.user_id,
  });

  if (saveData) {
    return NextResponse.json({ result: saveData }, { status: 201 });
  } else {
    return NextResponse.json(
      { msg: "Database connection error" },
      { status: 400 }
    );
  }
}
