import { connectToMongoDB } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import TaskModel from "@/app/model/task";
import ProjectModel from "@/app/model/projects";

const projectValidationSchema = z.object({
  project: z.string().min(3).max(100),
  name: z.string().min(3).max(100),
  description: z.string().min(3).max(500).optional(),
  start_end: z.date().nullable().optional(),
  end_date: z.date().nullable().optional(),
  priority: z.string().optional(),
  assigners: z
    .array(z.string().min(3).max(200)) // Array of strings with length constraints
    .min(1, { message: "At least one assigner is required" }), // Minimum 1 element in array
  status: z.string().optional(),
});

function generateTaskId(baseTaskId: string, count: Number) {
  const paddedCount = String(count).padStart(5, '0'); // Pads the count to 3 digits
  return `${baseTaskId}-${paddedCount}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToMongoDB();
  const result = await TaskModel.find({}).populate("assigners", "name");
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
  const validation: any = projectValidationSchema.safeParse(payload);

  await connectToMongoDB();
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const taskCount = await TaskModel.countDocuments({ project: validation.data.project });

  const projectDetail = await ProjectModel.findOne({ _id: validation.data.project });

  const task_id = generateTaskId(projectDetail.code, taskCount);
  
  const saveData = await TaskModel.create({...validation.data, task_id });

  if (saveData) {
    return NextResponse.json({ result: saveData }, { status: 201 });
  } else {
    return NextResponse.json(
      { msg: "Database connection error" },
      { status: 400 }
    );
  }
}
