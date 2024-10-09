import React, { useEffect, useState } from "react";
import { MultiSelect } from "../../components/ui/multi-select"; // Assuming correct import path

interface User {
  _id: string;
  name: string;
}

interface AssignersListProps {
  taskId: string; // Task ID to assign users to
  value: string[]; // Selected user IDs
  onChange: (value: string[]) => void; // Handler to update selected users
}

const AssignersList: React.FC<AssignersListProps> = ({
  taskId,
  value,
  onChange,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user");
        const data = await response.json();
        setUsers(data.result);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const userOptions = users.map((user) => ({
    label: user.name,
    value: user._id,
  }));

  // Function to assign users to a task
  const assignUsersToTask = async (selectedUsers: string[]) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/task?assign_type_member=add_member&task_id=${taskId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ assigners: selectedUsers }), // Send selected user IDs to the API
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign users to task");
      }

      const result = await response.json();
      console.log("Users assigned successfully", result);
    } catch (error) {
      console.error("Error assigning users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle change event from MultiSelect component
  const handleChange = (selectedUserIds: string[]) => {
    onChange(selectedUserIds); // Update parent component's selected users
    assignUsersToTask(selectedUserIds); // Assign users to task when selection changes
  };

  return (
    <div>
      <MultiSelect
        options={userOptions}
        onValueChange={handleChange}
        defaultValue={value}
        placeholder="Select users"
      />
      {loading && <p>Assigning users to the task...</p>}
    </div>
  );
};

export default AssignersList;
