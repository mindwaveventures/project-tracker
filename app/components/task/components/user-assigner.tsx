import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react"; // Import the 'X' icon for removing users
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Function to fetch users (API call to /api/user)
const fetchUsers = async () => {
  const response = await fetch("http://localhost:3000/api/user");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.result; // Ensure the correct structure is returned
};

// Function to add a user to the task
const addUserToTask = async (taskId, userId) => {
  const body = JSON.stringify({ user_id: userId });
  console.log("Sending body:", body);

  try {
    const response = await fetch(
      `http://localhost:3000/api/task?assign_type_member=add_member&task_id=${taskId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // Read the response body
      console.error("Error adding user:", errorText); // Log the raw error response
      return;
    }

    const result = await response.json();
    console.log("User added:", result); // Log the successful response
    return result; // Return the result
  } catch (error) {
    console.error("Error:", error);
  }
};

// Function to remove a user from the task
const removeUserFromTask = async (taskId, userId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/task?assign_type_member=remove_member&task_id=${taskId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error removing user:", errorData);
      return;
    }

    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

// Assigners column component
export const TaskAssigner = ({ row }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [assignedUsers, setAssignedUsers] = useState(
    row.original.assigners || []
  ); // Manage assigned users

  // Fetch users on component mount
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    getUsers();
  }, []);

  // Filter available users based on search term and assigned users
  useEffect(() => {
    const assignedUserIds = new Set(assignedUsers.map((user) => user._id));
    const availableUsers = users.filter(
      (user) => !assignedUserIds.has(user._id)
    );

    const filtered = availableUsers.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [users, assignedUsers, searchTerm]);

  const handleAddUser = async (userId) => {
    console.log("Adding user with ID:", userId);
    console.log("Task ID:", row.original.id);

    const updatedTask = await addUserToTask(row.original.id, userId);
    console.log("API response for adding user:", updatedTask);

    const newUser = users.find((user) => user._id === userId); // Find the user object
    if (newUser) {
      setAssignedUsers((prev) => [...prev, newUser]); // Update assigned users state
      toast({
        description: `${newUser.name} has been added.`,
      });
      setOpen(false); // Close the dropdown
    }
  };

  const handleRemoveUser = async (userId) => {
    console.log("Removing user with ID:", userId);
    console.log("Task ID:", row.original.id);

    const updatedTask = await removeUserFromTask(row.original.id, userId);
    console.log("API response for removing user:", updatedTask);

    setAssignedUsers((prev) => prev.filter((user) => user._id !== userId)); // Update assigned users state

    const removedUser = assignedUsers.find((user) => user._id === userId); // Find the removed user

    if (removedUser) {
      toast({
        description: `${removedUser.name} has been removed.`,
      });
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Display current assigners */}
      <div className="flex items-start -space-x-1">
        {assignedUsers.map((us) => (
          <TooltipProvider key={us._id ?? us.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative group">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={us.image_url}
                      alt={us.name}
                      className="w-6 h-6"
                    />
                    <AvatarFallback>{us.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {/* Remove button for each assigner */}
                  <div className="absolute inset-0 items-center justify-center hidden group-hover:flex">
                    <Button
                      variant="ghost"
                      size="xs"
                      className="p-0 !bg-primary !w-6 !h-6 rounded-full"
                      onClick={() => handleRemoveUser(us._id)}
                    >
                      <X className="w-4 h-4 text-primary-foreground" />
                    </Button>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{us.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Plus icon to add new assigner */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="bg-secondary p-0 w-6 h-6 rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        {/* Dropdown with user list */}
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search users..."
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>No users available.</CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user._id}
                    value={user._id}
                    onSelect={(currentValue) => {
                      handleAddUser(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Checkbox
                      className={`mr-2 h-4 w-4 ${
                        assignedUsers.some((u) => u._id === user._id)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {user.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
