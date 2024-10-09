import * as React from "react";
import { Check } from "lucide-react";
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

export function AddTask({ onTaskSelect }) {
  const [open, setOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/task");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data.result); // Assuming 'result' contains the list of tasks
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-[200px] justify-between"
        >
          Add Task
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search task..." />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading tasks...</CommandEmpty>
            ) : error ? (
              <CommandEmpty>Error: {error}</CommandEmpty>
            ) : tasks.length === 0 ? (
              <CommandEmpty>No task found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {tasks.map((task) => (
                  <CommandItem
                    key={task._id}
                    value={task.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      if (onTaskSelect) {
                        onTaskSelect(task); // Return the entire task object
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === task.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {task.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
