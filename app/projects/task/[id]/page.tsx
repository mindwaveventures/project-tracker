"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { DataTable } from "@/app/components/task/components/data-table";
import { columns } from "@/app/components/task/components/columns";
import AddTaskForm from "@/app/components/task/components/add-task-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "../../../../components/ui/back-button";
import PageContainer from "../../../components/layout/page-container";
import SkeletonTablePage from "../../../../components/ui/skeleton-table-page";

const assignerSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

const taskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  priority: z.string(),
  assigners: z.array(assignerSchema).nullable(),
  createdAt: z.string().datetime(),
  id: z.string(),
  title: z.string(),
  label: z.string(),
});

interface ITask {
  _id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  task_id: string;
  id: string;
  assigners: [
    {
      _id: string;
      name: string;
      image_url: string | null;
    }
  ];
  title: string;
  label: string;
  createdAt: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
}

interface ResponseInterface {
  project: Project;
  taskCount: number;
  tasks: ITask[];
}

export default function TaskPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [responseData, setResponsedata] = useState<ResponseInterface>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facets, setFacets] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const cachedData = sessionStorage.getItem(`projectData-${id}`);
    if (cachedData) {
      setResponsedata(JSON.parse(cachedData));
      setLoading(false);
    } else {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/project?include=task&project_id=${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const formattedData = {
        ...data.result,
        tasks: data.result.tasks
          .map((task: ITask) => ({
            ...task,
            id: task.task_id,
            title:
              "If we synthesize the microchip, we can get to the SAS sensor through the optical UDP program!",
            status: task.status,
            label: "documentation",
            priority: task.priority,
          }))
          .sort(
            (a: ITask, b: ITask) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
      };
      setResponsedata(formattedData);
      sessionStorage.setItem(
        `projectData-${id}`,
        JSON.stringify(formattedData)
      );
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseData?.tasks) {
      const taskCounts = {
        priority1: responseData.tasks.filter((task) => task.priority === "1")
          .length,
        priority2: responseData.tasks.filter((task) => task.priority === "2")
          .length,
        pending: responseData.tasks.filter((task) => task.status === "pending")
          .length,
      };

      const facets = new Map();
      facets.set("priority1", taskCounts.priority1);
      facets.set("priority2", taskCounts.priority2);
      facets.set("pending", taskCounts.pending);

      setFacets(facets);
    }
  }, [responseData]);

  const handleTaskCreated = async (newTask: ITask) => {
    setIsSubmitting(true);
    try {
      await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      await fetchData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
      closeDialog();
    }
  };

  function closeDialog() {
    setOpenDialog(false);
  }

  if (loading) return <SkeletonTablePage />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <PageContainer scrollable={true}>
        <div className="py-5 -ml-3">
          <BackButton />
        </div>
        <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {responseData?.project?.name}
              </h2>
              <p className="text-muted-foreground">
                Here's a list of your tasks for this month!
              </p>
            </div>

            {/* Add New Task Button */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setOpenDialog(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" /> Add New Task
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new task.
                  </DialogDescription>
                </DialogHeader>

                <AddTaskForm
                  onTaskCreated={handleTaskCreated}
                  closeDialog={() => setOpenDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Task Analytics Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="p-4 bg-card rounded-lg shadow-sm">
              <h3 className="text-lg font-medium">Total Tasks</h3>
              <p className="text-2xl font-bold">
                {responseData?.tasks.length || 0}
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-sm">
              <h3 className="text-lg font-medium">Total Priority 1</h3>
              <p className="text-2xl font-bold">
                {facets?.get("priority1") || 0}
              </p>
            </div>

            <div className="p-4 bg-card rounded-lg shadow-sm">
              <h3 className="text-lg font-medium">Total Priority 2</h3>
              <p className="text-2xl font-bold">
                {facets?.get("priority2") || 0}
              </p>
            </div>

            <div className="p-4 bg-card rounded-lg shadow-sm">
              <h3 className="text-lg font-medium">Pending Tasks</h3>
              <p className="text-2xl font-bold">
                {facets?.get("pending") || 0}
              </p>
            </div>
          </div>

          {responseData?.tasks ? (
            <DataTable data={responseData.tasks} columns={columns} />
          ) : (
            <Skeleton className="h-40 w-full" />
          )}
        </div>
      </PageContainer>
    </>
  );
}
