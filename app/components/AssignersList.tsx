import React, { useEffect, useState } from "react";
import { MultiSelect } from "../../components/ui/multi-select";

interface User {
  _id: string;
  name: string;
}

interface AssignersListProps {
  value: string[]; // The selected user IDs
  onChange: (value: string[]) => void; // Change handler to update the selected users
}

const AssignersList: React.FC<AssignersListProps> = ({ value, onChange }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user");
        const data = await response.json();

        // Assuming result is an array of user objects
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

  return (
    <div>
      <MultiSelect
        options={userOptions}
        onValueChange={onChange}
        defaultValue={value}
        placeholder="Select users"
      />
    </div>
  );
};

export default AssignersList;
