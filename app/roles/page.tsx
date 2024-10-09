"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import SearchBar from "@/components/ui/search";
import PageContainer from "../components/layout/page-container";
import React from "react";
import ProjectSkeletonLoader from "@/components/ui/skeleton-project";

interface Role {
  _id: string;
  name: string;
  status: string;
  created_by: string;
  permission: string[];
}

export default function RolesCard() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/role");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRoles(data.result);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Handle form submission
  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("http://localhost:3000/api/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error creating role");

      const newRole = await response.json();
      setRoles((prevRoles) => [...prevRoles, newRole.result]);
      toast({ description: "Role created successfully!" });
      reset(); // Reset form
      setOpenDialog(false); // Close dialog
    } catch (error: any) {
      toast({ description: "Failed to create role", variant: "destructive" });
    }
  };

  if (loading) return <ProjectSkeletonLoader />;
  if (error) return <p>Error: {error}</p>;

  // Filter roles based on the search query
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <div className="container mx-auto gap-10 grid">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Roles</h2>
        </div>
        <div className="flex gap-4 justify-between">
          <SearchBar
            placeholder="Search for a role..."
            value={searchQuery}
            onChange={(query) => setSearchQuery(query)}
            className="w-full md:w-[500px]"
          />
          {/* Add New Role Button */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>Add New Role</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Role</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Role Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter role name"
                      {...register("name", {
                        required: "Role name is required",
                        minLength: 3,
                      })}
                    />
                    {errors.name && (
                      <p className="text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      placeholder="Enter status (e.g., active, inactive)"
                      {...register("status", {
                        required: "Status is required",
                      })}
                    />
                    {errors.status && (
                      <p className="text-red-600">{errors.status.message}</p>
                    )}
                  </div>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* List of Roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => (
              <Card key={role._id}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-1">{role.name}</h3>
                    <Badge variant="secondary" className="mb-2">
                      {role.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-2">
                      Created by: {role.created_by}
                    </p>
                    <div className="flex flex-wrap justify-center space-x-2">
                      {(role.permission ?? []).length > 0 ? (
                        role.permission.map((perm) => (
                          <Badge key={perm} variant="outline" className="mb-1">
                            {perm}
                          </Badge>
                        ))
                      ) : (
                        <p>No Permissions Assigned</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No roles found.</p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
