"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Employee {
  _id: number;
  name: string;
  role: {
    _id: string;
    name: string;
  };
  department: string;
  email: string;
  image_url: string;
}

const employees: Employee[] = [];

export default function ExployeesCard() {
  const [users, setUsers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching users from an API
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user"); // Example API
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data.result);
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
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.length > 0 && users.map((employee) => (
          <Card key={employee._id}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={employee.image_url} alt={employee.name} />
                  <AvatarFallback>
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold mb-1">{employee.name}</h3>
                {/* <p className="text-sm text-muted-foreground mb-2">
                  
                </p> */}
                <Badge variant="secondary" className="mb-2">
                  {employee.role?.name}
                </Badge>
                <a
                  href={`mailto:${employee.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {employee.email}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
