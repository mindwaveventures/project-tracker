import { connectToMongoDB } from "@/app/lib/db";
import RoleModel from "@/app/model/roles";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import ProjectModel from "@/app/model/projects";
import { z } from "zod";

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

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToMongoDB();
  const result = await RoleModel.find({});
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
