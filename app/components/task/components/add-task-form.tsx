import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AssignersList from "../../../components/AssignersList"; // Ensure the correct path
import { Label } from "@/components/ui/label";
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
import { useParams } from "react-router-dom"; // Import to handle dynamic taskId from route

// Define the validation schema using zod
const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.string().min(1, "Priority is required"),
  assigners: z.array(z.string()).min(1, "At least one assigner is required"),
  project: z.string().min(1, "Project is required"),
  billing_type: z.string().min(1, "Billing type is required"),
});

interface AddTaskFormProps {
  onTaskCreated: (task: ITask) => void;
}

type TaskFormValues = z.infer<typeof taskSchema>;

export default function AddTaskForm({ onTaskCreated }: AddTaskFormProps) {
  const [projects, setProjects] = useState<{ _id: string; name: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { taskId } = useParams(); // Get dynamic taskId from URL

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: "",
      assigners: [],
      project: "",
      billing_type: "",
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    // Fetch projects
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/project?include=task"
        );
        const data = await response.json();
        if (data.result) {
          setProjects(data.result);
          if (data.result.length > 0) {
            const defaultProject = data.result[0];
            setSelectedProject(defaultProject._id);
            setValue("project", defaultProject._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      }
    };
    fetchProjects();

    // Fetch task details if editing (using taskId)
    if (taskId) {
      const fetchTaskDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/task/${taskId}`
          );
          const taskData = await response.json();
          if (taskData) {
            setValue("name", taskData.name);
            setValue("description", taskData.description);
            setValue("priority", taskData.priority);
            setValue("assigners", taskData.assigners);
            setValue("project", taskData.project);
            setValue("billing_type", taskData.billing_type);
          }
        } catch (error) {
          console.error("Failed to fetch task details:", error);
        }
      };
      fetchTaskDetails();
    }
  }, [taskId, setValue]);

  const onSubmit = async (data: TaskFormValues) => {
    const url = "http://localhost:3000/api/task"; // Always create a new task with POST

    try {
      const response = await fetch(url, {
        method: "POST", // Always use POST for task creation
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(JSON.stringify(errorResponse));
      }

      const task = await response.json();
      onTaskCreated(task);
      toast({ title: "Task created successfully!" });
      reset();
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast({
        title: "Error creating task",
        description: error.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Task Name */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Task Name
        </Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Enter task name"
              className="block w-full"
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Description
        </Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Enter task description"
              className="block w-full"
            />
          )}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Priority */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Priority
        </Label>
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

      {/* Project */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Project
        </Label>
        <Controller
          name="project"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project._id} value={project._id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.project && (
          <p className="text-red-500 text-sm">{errors.project.message}</p>
        )}
      </div>

      {/* Billing Type */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Billing Type
        </Label>
        <Controller
          name="billing_type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select billing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="non_billing">Non-billing</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.billing_type && (
          <p className="text-red-500 text-sm">{errors.billing_type.message}</p>
        )}
      </div>

      {/* Assigners */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Assigners
        </Label>
        <Controller
          name="assigners"
          control={control}
          render={({ field }) => (
            <AssignersList
              value={field.value} // Ensure this holds an array of selected assigners
              onChange={field.onChange} // This should properly update the form with selected assigners
              taskId={taskId}
            />
          )}
        />
        {errors.assigners && (
          <p className="text-red-500 text-sm">{errors.assigners.message}</p>
        )}
      </div>

      {/* Button Label based on taskId */}
      <div className="flex justify-end mt-4">
        <Button type="submit">
          {taskId ? "Update Task" : "Create Task"} {/* Conditional label */}
        </Button>
      </div>
    </form>
  );
}
