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

// Timelinse start utility

// Function to extract unique dates from timeLogs

function getUniqueDates(timeLogs: any) {
  const dateSet = new Set();
  timeLogs.forEach((log: any) => {
    const date = new Date(log.date).toISOString().split("T")[0]; // Get date in YYYY-MM-DD format
    dateSet.add(date);
  });
  return Array.from(dateSet).sort(); // Sort dates for better display
}

// Transform function to create timesheet data dynamically based on selected dates
function transformTimesheetData(timeLogs: any, selectedDates: any) {
  // Collect tasks with their respective hours per selected date
  const tasksMap = new Map();

  // Iterate through each log entry
  timeLogs.forEach((log: any) => {
    const taskId = log.task.task_id;
    const date = new Date(log.date).toISOString().split("T")[0];

    if (!tasksMap.has(taskId)) {
      tasksMap.set(taskId, {
        task_id: taskId,
        task_name: log.task.name,
        hours: selectedDates.reduce((acc: any, d) => {
          acc[d] = 0; // Initialize all selected dates with 0 hours
          return acc;
        }, {}),
      });
    }

    const taskData = tasksMap.get(taskId);
    if (selectedDates.includes(date)) {
      taskData.hours[date] += log.duration; // Accumulate duration for the date if it falls within selected dates
    }
  });

  // Ensure every task has an entry for each selected date
  tasksMap.forEach((taskData) => {
    selectedDates.forEach((date: any) => {
      if (!taskData.hours.hasOwnProperty(date)) {
        taskData.hours[date] = 0;
      }
    });
  });

  const transformedData = {
    tasks: Array.from(tasksMap.values()), // Convert Map to array
    dates: selectedDates,
  };

  return transformedData;
}

// Timeline end

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

  const findQuery: any = {};

  if (response_type === "timeline") {
    if (!start_date || !end_date) {
      return NextResponse.json(
        { msg: !start_date ? "start_date is missing " : "end_date is missong" },
        { status: 400 }
      );
    }
  }

  if (project_id) findQuery.project = project_id;

  const result = await TimeSheetModel.find(findQuery)
    .populate("created_by", "name image_url")
    .populate("task", "name task_id description status priority");
  return NextResponse.json({
    result:
      response_type === "daywise"
        ? groupTasksByDateLast7Days(result)
        : response_type === "timeline"
        ? transformTimesheetData(
            result,
            getDatesBetween(
              start_date || new Date().toISOString(),
              end_date || new Date().toISOString()
            )
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
