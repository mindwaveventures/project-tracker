"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import SearchBar from "@/components/ui/search";
import PageContainer from "../components/layout/page-container";
import React from "react";
import ProjectSkeletonLoader from "@/components/ui/skeleton-project";

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

export default function ExployeesCard() {
  const [users, setUsers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

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

  if (loading) return <ProjectSkeletonLoader />;
  if (error) return <p>Error: {error}</p>;

  // Filter users based on the search query
  const filteredUsers = users.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">Our Team</h2>
        <div className="grid gap-10 ">
          <div className="flex">
            <SearchBar
              placeholder="Search for a name..."
              value={searchQuery}
              onChange={(query) => setSearchQuery(query)}
              className="w-full md:w-[500px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((employee) => (
                <Card key={employee._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage
                          src={employee.image_url}
                          alt={employee.name}
                        />
                        <AvatarFallback>
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold mb-1">
                        {employee.name}
                      </h3>
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
              ))
            ) : (
              <p>No employees found.</p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
