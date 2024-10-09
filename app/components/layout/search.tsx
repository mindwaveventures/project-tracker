"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import clsx from "clsx";

const Search = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFocus = () => setIsExpanded(true);
  const handleBlur = () => setIsExpanded(false);

  return (
    <form className="flex items-center border rounded-lg p-0">
      <div className="relative">
        {/* Search Icon */}
        <SearchIcon
          className="absolute left-2 top-2 h-[1.2rem] w-[1.2rem] hover:border-primary  text-gray-500 dark:text-gray-400 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        />

        {/* Input field */}
        <Input
          type="search"
          placeholder="Search..."
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={clsx("transition-all duration-300 pl-8 !px-[4px]", {
            "w-9 opacity-0 pointer-events-none": !isExpanded,
            "w-[200px] sm:w-[250px] opacity-100 pointer-events-auto":
              isExpanded,
          })}
        />
      </div>
    </form>
  );
};

export default Search;
