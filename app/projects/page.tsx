"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProjectListCard from "../components/ProjectListCard";
import SearchBar from "@/components/ui/search"; // Make sure to import your SearchBar component
import PageContainer from "../components/layout/page-container";
import ProjectSkeletonLoader from "../../components/ui/skeleton-project";

interface Projects {
  _id: string;
  name: string;
  color: string;
  assigners: [
    {
      _id: string;
      name: string;
      image_url: string | null;
    }
  ];
  status: string;
  taskCount: number;
  createdAt: string;
}

export default function ExployeesCard() {
  const [project, setProject] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query); // Update search query state when the user types
  };

  useEffect(() => {
    // Fetching users from an API
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/project");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProject(data.result);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <ProjectSkeletonLoader />;
  if (error) return <p>Error: {error}</p>;

  // Filter projects by the search query
  const filteredProjects = project.filter((proj) =>
    proj.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageContainer>
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">Our Projects</h2>

          {/* SearchBar Component */}
          <SearchBar
            value={searchQuery}
            onChange={handleSearch} // Call handleSearch when the search input changes
            className="mb-8 w-full md:w-1/2 lg:w-1/3" // Add custom styles
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <React.Fragment key={project._id}>
                  <ProjectListCard
                    id={project._id}
                    projectName={project.name}
                    createdBy={{
                      name: project.assigners[0].name,
                      avatarUrl: project.assigners[0].image_url || "-",
                    }}
                    taskCount={project.taskCount}
                  />
                </React.Fragment>
              ))
            ) : (
              <p>No projects found</p>
            )}
          </div>
        </div>
      </PageContainer>
    </>
  );
}
