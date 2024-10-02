"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import TimePicker from "@/components/ui/timepicker"; // Adjust the import path as needed
import { AddTask } from "./AddTask";

interface TimesheetTableProps {
  tasks: any[];
  days: Date[];
  handleTimeChange: (taskId: number, dayStr: string, newTime: string) => void;
  handleTaskSelect: (selectedTask: string) => void;
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({
  tasks,
  days,
  handleTimeChange,
  handleTaskSelect,
}) => {
  // Function to handle time change
  const handleTimePickerChange = (
    taskId: number,
    dayStr: string,
    newTime: string
  ) => {
    handleTimeChange(taskId, dayStr, newTime); // Call the parent's handler with the new time
  };

  return (
    <Table className="table-auto rounded-lg border-collapse border border-gray-300 w-full">
      <TableHeader>
        <TableRow className="bg-gray-100 border border-gray-300">
          <TableHead className="border border-gray-300 w-10">Sl. No</TableHead>
          <TableHead className="border border-gray-300 w-1/4">Task</TableHead>
          <TableHead className="border border-gray-300 w-28">
            Category
          </TableHead>
          {days.map((day) => (
            <TableHead
              key={day.toISOString()}
              className="border border-gray-300 text-center"
            >
              <div>{format(day, "yyyy-MM-dd")}</div>
              <div>{format(day, "EEEE")}</div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task, index) => (
          <TableRow key={task.task_id} className="border border-gray-300">
            <TableCell className="border border-gray-300 text-center">
              {index + 1}
            </TableCell>
            <TableCell className="border border-gray-300">
              {task.task_name}
            </TableCell>
            <TableCell className="border border-gray-300">
              {task.category}
            </TableCell>
            {days.map((day) => {
              const dayStr = format(day, "yyyy-MM-dd");
              return (
                <TableCell
                  key={dayStr}
                  className="border border-gray-300 p-0 w-24"
                >
                  <TimePicker
                    onTimeChange={(newTime) =>
                      handleTimeChange(task.task_id, dayStr, newTime)
                    }
                  />
                </TableCell>
              );
            })}
          </TableRow>
        ))}

        {/* Add Task Row */}
        <TableRow className="border border-gray-300">
          <TableCell className="border border-gray-300 text-center">
            <Plus className="h-4 w-4 text-black cursor-pointer" />
          </TableCell>
          <TableCell
            colSpan={days.length + 2}
            className="border border-gray-300"
          >
            <AddTask onTaskSelect={handleTaskSelect} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TimesheetTable;
