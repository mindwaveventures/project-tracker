"use client";
import Image from "next/image";
import { z } from "zod";
import { DataTable } from "@/app/components/task/components/data-table";
import { columns } from "@/app/components/task/components/columns";
import { useEffect, useState } from "react";

const assignerSchema = z.object({
  _id: z.string(), // Assigner _id
  name: z.string(), // Assigner name
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

  useEffect(() => {
    // Fetching users from an API
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/project?include=task&project_id=${id}`
        ); // Example API
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResponsedata({
          ...data.result,
          tasks: data.result.tasks.map((data: ITask) => ({
            ...data,
            id: data.task_id,
            title:
              "If we synthesize the microchip, we can get to the SAS sensor through the optical UDP program!",
            status: data.status,
            label: "documentation",
            priority: data.priority,
          })),
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{responseData?.project?.name}</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        {responseData?.tasks && (
          <DataTable data={responseData.tasks} columns={columns} />
        )}
      </div>
    </>
  );
}
