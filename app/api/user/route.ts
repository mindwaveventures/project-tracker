import { connectToMongoDB } from "@/app/lib/db";
import RoleModel from "@/app/model/roles";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToMongoDB();
  const ottApplications = await RoleModel.find({});
  return NextResponse.json({
    result: ottApplications,
  });
}

// export async function POST(request: NextRequest) {
//   const payload = await request.json();
//   const validation: any = ottApplicationSchema.safeParse(payload);

//   await connectDB();
//   if (!validation.success) {
//     return NextResponse.json(validation.error.format(), { status: 400 });
//   }

//   const saveData = await OTTApplicationModel.create(validation.data);

//   if (saveData) {
//     return NextResponse.json({ result: saveData }, { status: 201 });
//   } else {
//     return NextResponse.json(
//       { msg: 'Database connection error' },
//       { status: 400 }
//     );
//   }
// }
