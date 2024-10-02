"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, statuses } from "../data/data";
import { Task } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "des",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descption" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);
      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("des")}
          </span>
          <div className="flex items-start -space-x-1">
            {row.original.assigners &&
              row.original.assigners.length > 0 &&
              row.original.assigners.map((us: any) => (
                <TooltipProvider key={Math.random()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="w-6 h-6 ">
                        <AvatarImage
                          src={us.image_url}
                          alt={us.name}
                          className="w-6 h-6"
                        />
                        <AvatarFallback>{us.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{us.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const currentStatus = row.getValue("status");

      return (
        <Select
          defaultValue={currentStatus}
          onValueChange={(newStatus) => {
            // Update the status value in your state/store
            row.original.status = newStatus; // Update logic here based on your state management
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <div className="flex items-center">
                  {status.icon && (
                    <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  {status.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const currentPriority = row.getValue("priority");

      return (
        <Select
          defaultValue={currentPriority}
          onValueChange={(newPriority) => {
            // Update the priority value in your state/store
            row.original.priority = newPriority; // Update logic here based on your state management
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                <div className="flex items-center">
                  {priority.icon && (
                    <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  {priority.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
