import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
const assignerSchema = z.object({
  _id: z.string(), // Assigner _id
  name: z.string(), // Assigner name
});

export const taskSchema = z.object({
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


export type Task = z.infer<typeof taskSchema>
