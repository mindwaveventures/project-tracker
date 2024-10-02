// components/Timesheet.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import CategoryFilter from "./components/CategoryFilter";
import BillingFilter from "./components/BillingFilter";
import TimesheetTable from "./components/TimesheetTable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import moment from "moment";

// Task data
const timesheetData = {
  tasks: [
    {
      task_id: 1,
      task_name: "Task A",
      category: "Brook",
      billing_type: "Billable",
      hours: {
        "2024-09-25": "04:00",
        "2024-09-26": "05:00",
        "2024-09-27": "03:00",
      },
    },
    {
      task_id: 2,
      task_name: "Task B",
      category: "MAIA",
      billing_type: "Non-billable",
      hours: {
        "2024-09-25": "02:00",
        "2024-09-26": "06:00",
        "2024-09-27": "04:00",
      },
    },
  ],
};

const getDatesForView = (date: Date, view: string) => {
  if (view === "week") {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  } else if (view === "month") {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  } else {
    return [date];
  }
};

const Timesheet = () => {
  const [view, setView] = useState("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [billingFilter, setBillingFilter] = useState("");
  const [dateRangeArray, setDateRangeArray] = useState<[]>([]);

  const categories = ["Brook", "MAIA"]; // Dynamic categories based on projects
  const billingTypes = ["Billable", "Non-billable"];

  const [selectedView, setSelectedView] = React.useState("week");

  const handleViewChange = (view: string) => {
    setSelectedView(view);
    setView(view);
  };

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/timesheet?response_type=timeline&start_date=2024-08-24&end_date=2024-08-30`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data?.result?.tasks);
        setDateRangeArray(data.result?.dates)
      } catch (error: any) {
        console.log("error", error);

        // setError(error.message);
      }
    };
    console.log("get my task detail");

    fetchMyTasks();
  }, []); // Add id as a dependency to re-fetch data if it changes

  const days = getDatesForView(selectedDate, view);

  const handleTaskSelect = (selectedTask: string) => {
    // Add new task to the task list
    const newTask = {
      task_id: tasks.length + 1,
      task_name: selectedTask,
      category: "Uncategorized",
      billing_type: "Billable",
      hours: {},
    };
    setTasks([...tasks, newTask]);
  };

  const handleTimeChange = (
    taskId: number,
    dayStr: string,
    newTime: string
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.task_id === taskId
        ? {
            ...task,
            hours: {
              ...task.hours,
              [dayStr]: newTime,
            },
          }
        : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="flex flex-col gap-5 w-full p-4">
      <h2 className="text-2xl font-bold">Timesheet</h2>
      <div className="flex flex-col gap-2">
        {/* Search and Filters */}
        <div className="flex justify-between mb-4 gap-4">
          <div className="relative w-1/3">
            <Input
              placeholder="Search Task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex gap-4">
            <div className="flex space-x-4">
              <CategoryFilter
                categories={categories}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
              <BillingFilter
                billingTypes={billingTypes}
                billingFilter={billingFilter}
                setBillingFilter={setBillingFilter}
              />
            </div>
            <div className="flex space-x-2">
              <ToggleGroup
                type="single"
                value={selectedView} // controlled value
                aria-label="View Options"
                className="flex space-x-2"
              >
                {/* <ToggleGroupItem
                  value="month"
                  aria-label="Month View"
                  className={cn(
                    "px-4 py-2 text-sm font-medium",
                    selectedView === "month" ? "!bg-primary !text-white" : ""
                  )}
                  onClick={() => handleViewChange("month")}
                >
                  Month
                </ToggleGroupItem> */}
                <ToggleGroupItem
                  value="week"
                  aria-label="Week View"
                  className={cn(
                    "px-4 py-2 text-sm font-medium",
                    selectedView === "week" ? "!bg-primary !text-white" : ""
                  )}
                  onClick={() => handleViewChange("week")}
                >
                  Week
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="day"
                  aria-label="Day View"
                  className={cn(
                    "px-4 py-2 text-sm font-medium",
                    selectedView === "day" ? "!bg-primary !text-white" : ""
                  )}
                  onClick={() => handleViewChange("day")}
                >
                  Day
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
        {/* Timesheet Table */}
        {tasks && tasks.length > 0 && (
          <TimesheetTable
            tasks={tasks}
            days={dateRangeArray.map((d) => moment(new Date(d)).toDate())}
            handleTimeChange={handleTimeChange}
            handleTaskSelect={handleTaskSelect}
          />
        )}
      </div>
    </div>
  );
};

export default Timesheet;
