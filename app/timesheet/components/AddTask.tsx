"use client";

import * as React from "react";
import { Check } from "lucide-react"; // Removed the Plus and ChevronsUpDown icons

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Example task options
const taskOptions = [
  { value: "task_a", label: "Task A" },
  { value: "task_b", label: "Task B" },
  { value: "task_c", label: "Task C" },
];

export function AddTask({ onTaskSelect }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-[200px] justify-between"
        >
          Add Task {/* Always show "Add Task" */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search task..." />
          <CommandList>
            <CommandEmpty>No task found.</CommandEmpty>
            <CommandGroup>
              {taskOptions.map((task) => (
                <CommandItem
                  key={task.value}
                  value={task.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    if (onTaskSelect) {
                      onTaskSelect(currentValue);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === task.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {task.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
