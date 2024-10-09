import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectSkeletonLoader = () => {
  return (
    <div className="space-y-4 p-6">
      {/* Title Skeleton */}
      <Skeleton className="h-8 w-1/4" />

      {/* Paragraph Skeleton */}
      <Skeleton className="h-5 w-2/3" />

      {/* Search Bar Skeleton */}
      <Skeleton className="h-10 w-1/3" />

      {/* Project Cards Skeleton - 4 Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            {/* Card Image Skeleton */}
            <Skeleton className="h-40 w-full" />
            {/* Card Title Skeleton */}
            <Skeleton className="h-6 w-3/4" />
            {/* Card Description Skeleton */}
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSkeletonLoader;
