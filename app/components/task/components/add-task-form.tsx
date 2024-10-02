import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AssignersList from "../../../components/AssignersList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { priorities } from "../data/data";

// Define the validation schema using zod
const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.string().min(1, "Priority is required"),
  assigners: z.array(z.string()).min(1, "At least one assigner is required"),
});

interface AddTaskFormProps {
  onTaskCreated: (task: ITask) => void; // Define the prop type
}

type TaskFormValues = z.infer<typeof taskSchema>;

export default function AddTaskForm({ onTaskCreated }: AddTaskFormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: "",
      assigners: [],
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: TaskFormValues) => {
    console.log("Submitting data:", data);
    try {
      const response = await fetch("http://localhost:3000/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      const newTask: ITask = await response.json(); // Assuming the response contains the new task data
      onTaskCreated(newTask); // Call the prop function to update tasks
      toast({ title: "Task created successfully!" });
      reset();
    } catch (error) {
      toast({ title: "Error creating task", description: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Task Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Task Name
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Enter task name"
              className="mt-1 block w-full"
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Enter task description"
              className="mt-1 block w-full"
            />
          )}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Priority Input (Select Dropdown) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.priority && (
          <p className="text-red-500 text-sm">{errors.priority.message}</p>
        )}
      </div>

      {/* Assigners Input (Using AssignersList Component) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assigners
        </label>
        <Controller
          name="assigners"
          control={control}
          render={({ field }) => (
            <AssignersList value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.assigners && (
          <p className="text-red-500 text-sm">{errors.assigners.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="mt-4">
        Create Task
      </Button>
    </form>
  );
}
