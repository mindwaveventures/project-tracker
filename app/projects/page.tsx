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
  taskCount: Number;
  createdAt: string;
}

export default function ExployeesCard() {
  const [project, setProject] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement your search logic here
  };

  useEffect(() => {
    // Fetching users from an API
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/project"); // Example API
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

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="w-full bg-primary py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8">
            Find What Youre Looking For
          </h1>
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="Search for anything..."
                className="flex-grow text-lg py-6 px-4 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </form>
          <p className="text-white text-center mt-6">
            Popular searches: Web Design, JavaScript, React, Next.js
          </p>
        </div>
      </div>
      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-bold mb-6">Our Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {project.length > 0 &&
            project.map((project) => (
              <React.Fragment key={Math.random()}>
                <ProjectListCard
                  id={project._id}
                  projectName={project.name}
                  createdBy={{
                    name: project.assigners[0].name,
                    avatarUrl: project.assigners[0].image_url || '-'
                  }}
                  taskCount={project.taskCount}
                />
              </React.Fragment>
            ))}
        </div>
      </div>
    </>
  );
}
