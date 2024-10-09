import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonTablePage = () => {
  return (
    <div className="p-4 md:p-10">
      <div className="space-y-4">
        {/* Title Skeleton */}
        <Skeleton className="h-8 w-1/3" />

        {/* Paragraph Skeleton */}
        <Skeleton className="h-5 w-2/3" />

        {/* Search Field Skeleton */}
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-1/4" /> {/* Search Input */}
          <Skeleton className="h-10 w-1/5" /> {/* Button */}
          <Skeleton className="h-10 w-1/6" /> {/* Filter Button */}
        </div>

        {/* Table Skeleton */}
        <div className="mt-6 space-y-2">
          {/* Table Header Skeleton */}
          <div className="grid grid-cols-6 gap-4">
            <Skeleton className="h-6 col-span-1" /> {/* Column Header 1 */}
            <Skeleton className="h-6 col-span-1" /> {/* Column Header 2 */}
            <Skeleton className="h-6 col-span-1" /> {/* Column Header 3 */}
            <Skeleton className="h-6 col-span-1" /> {/* Column Header 4 */}
            <Skeleton className="h-6 col-span-1" /> {/* Column Header 5 */}
            <Skeleton className="h-6 col-span-1" /> {/* Column Header 6 */}
          </div>

          {/* Table Row Skeletons */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4">
              <Skeleton className="h-6 col-span-1" /> {/* Row Cell 1 */}
              <Skeleton className="h-6 col-span-1" /> {/* Row Cell 2 */}
              <Skeleton className="h-6 col-span-1" /> {/* Row Cell 3 */}
              <Skeleton className="h-6 col-span-1" /> {/* Row Cell 4 */}
              <Skeleton className="h-6 col-span-1" /> {/* Row Cell 5 */}
              <Skeleton className="h-6 col-span-1" /> {/* Row Cell 6 */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonTablePage;
