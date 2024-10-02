import { connectToMongoDB } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import TaskModel from "@/app/model/task";

const projectValidationSchema = z.object({
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
  const validation = projectValidationSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  await connectToMongoDB();
  const saveData = await TaskModel.create(validation.data);

  if (saveData) {
    return NextResponse.json({ result: saveData }, { status: 201 });
  } else {
    return NextResponse.json(
      { msg: "Database connection error" },
      { status: 400 }
    );
  }
}
