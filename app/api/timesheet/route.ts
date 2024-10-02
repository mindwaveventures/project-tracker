import { connectToMongoDB } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import TaskModel from "@/app/model/task";
import TimeSheetModel from "@/app/model/timesheet";

const timesheetValidationSchema = z.object({
  task: z.string().min(3).max(100),
  description: z.string().nullable().optional(),
  duration: z.number().min(1).max(12),
  date: z.string().transform((str) => new Date(str)),
});

function getDatesBetween(startDate: string, endDate: string) {
  const dates = [];
  let currentDate = moment(startDate);

  // Keep adding days until current date reaches or passes the end date
  while (currentDate.isSameOrBefore(endDate)) {
    dates.push(currentDate.format("YYYY-MM-DD")); // Format the date as 'YYYY-MM-DD'
    currentDate = currentDate.add(1, "days"); // Move to the next day
  }

  return dates;
}

// Function to generate timesheet response
const generateTimesheetResponse = (
  data: any,
  startDate: string | null,
  endDate: string | null
) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const timesheetResponse: any = { dates: [], tasks: [] };

  // Collect the list of dates within the range
  for (
    let date = start.clone();
    date.isSameOrBefore(end);
    date.add(1, "days")
  ) {
    timesheetResponse.dates.push(date.format("YYYY-MM-DD"));
  }

  console.log("data.resul", data);

  data.forEach((task: any) => {
    const taskTimesheet: any = {};

    // Initialize task name and id
    taskTimesheet.task_id = task.task_id;
    taskTimesheet.task_name = task.name;
    taskTimesheet.category = 'Brook';
    taskTimesheet.billing_type = 'Billing';
    taskTimesheet.hours = {};

    console.log('task.project', taskTimesheet);
    

    // For each date, add the corresponding hours
    for (let date = start.clone(); date.isSameOrBefore(end); date.add(1, 'days')) {
      const currentDate = date.format('YYYY-MM-DD');
      let dailyDuration = 0;

      // Calculate the total duration for the current date
      task.timesheet.forEach((entry: any) => {
        const entryDate = moment(entry.date).format('YYYY-MM-DD');
        if (entryDate === currentDate) {
          dailyDuration += entry.duration;
        }
      });

      // Add the date as key and duration as value in the hours object
      taskTimesheet.hours[currentDate] = dailyDuration;
    }

    timesheetResponse.tasks.push(taskTimesheet);
  });

  return timesheetResponse;
};

// Timelinse end utility

// Helper function to format the date (e.g., 2024-09-28)
const formatDate = (date: Date) => date.toISOString().split("T")[0];

// Function to filter the data for the last 7 days
function groupTasksByDateLast7Days(data: any) {
  // Group tasks by date
  const groupedTasks = data.reduce((acc: any, item: any) => {
    const taskDate = formatDate(new Date(item.date));

    // Initialize the array if the date doesn't exist
    if (!acc[taskDate]) {
      acc[taskDate] = [];
    }

    // Add the task to the corresponding date
    acc[taskDate].push(item);
    return acc;
  }, {});

  return groupedTasks;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToMongoDB();

  const url = new URL(request.url); // Create a URL object from the request URL
  const queryParams = url.searchParams; // Get query parameters
  const response_type = queryParams.get("response_type"); // Extract specific query parameters
  const project_id = queryParams.get("project"); // Extract specific query parameters
  const start_date = queryParams.get("start_date"); // Extract specific query parameters
  const end_date = queryParams.get("end_date"); // Extract specific query parameters
  let user_id = queryParams.get("user_id"); // Extract specific query parameters

  const findQuery: any = {};

  if (response_type === "timeline") {
    if (!start_date || !end_date) {
      return NextResponse.json(
        { msg: !start_date ? "start_date is missing " : "end_date is missong" },
        { status: 400 }
      );
    }
  }

  if (!user_id) {
    findQuery.created_by = session?.user?.user_id;
  }

  if (project_id) findQuery.project = project_id;

  const assignesTask = await TaskModel.find({
    assigners: { $in: [session?.user?.user_id] },
  })

  const taskIds = assignesTask.map((task) => task._id);

  if (taskIds.length > 0) {
    findQuery.task = { $in: taskIds };
  }

  const result = await TimeSheetModel.find(findQuery).select(
    "date duration task"
  );

  const assignesTaskWithTimeSheet: any = assignesTask.map((task) => {
    const taskData = { ...task._doc };
    return {
      ...taskData,
      timesheet: result.filter(
        (t) => t.task.toString() === taskData._id.toString()
      ),
    };
  });

  // getDatesBetween(
  //   start_date || new Date().toISOString(),
  //   end_date || new Date().toISOString()
  // )
  // return NextResponse.json({
  //   result: assignesTaskWithTimeSheet
  // });

  return NextResponse.json({
    result:
      response_type === "daywise"
        ? groupTasksByDateLast7Days(result)
        : response_type === "timeline"
        ? generateTimesheetResponse(
            assignesTaskWithTimeSheet,
            start_date,
            end_date
          )
        : result,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const validation: any = timesheetValidationSchema.safeParse(payload);

  await connectToMongoDB();
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const taskDetails = await TaskModel.findOne({ _id: validation.data.task });

  console.log("taskDetails", taskDetails);

  const saveData = await TimeSheetModel.create({
    ...validation.data,
    created_by: session?.user?.user_id,
    project: taskDetails.project,
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
