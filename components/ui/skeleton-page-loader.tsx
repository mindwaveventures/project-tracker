import { Skeleton } from "@/components/ui/skeleton";

const PageLoader = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-72 h-screen border-r p-6 space-y-6">
        {/* Logo */}
        <Skeleton className="h-12 w-32" />
        {/* Menu Items */}
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-3/4" />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 bg-gray-100">
          {/* Placeholder for Title or Left Side (empty) */}
          <div />
          {/* Icon Buttons */}
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" /> {/* Icon 1 */}
            <Skeleton className="h-10 w-10 rounded-full" /> {/* Icon 2 */}
            <Skeleton className="h-10 w-10 rounded-full" /> {/* Icon 3 */}
          </div>
        </div>

        {/* Main Body with Box Loader */}
        <div className="flex-1 p-10 flex items-center justify-center bg-white">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
