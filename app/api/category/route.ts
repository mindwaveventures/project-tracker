import { connectToMongoDB } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import CategoryModel from "@/app/model/category";

const categoryValidationSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(3).max(500).optional(),
  status: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToMongoDB();
  const result = await CategoryModel.find({});
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
  const validation: any = categoryValidationSchema.safeParse(payload);

  await connectToMongoDB();
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const saveData = await CategoryModel.create(validation.data);

  if (saveData) {
    return NextResponse.json({ result: saveData }, { status: 201 });
  } else {
    return NextResponse.json(
      { msg: "Database connection error" },
      { status: 400 }
    );
  }
}
