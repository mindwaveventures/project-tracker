import React from "react";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"; // Radix UI search icon or any icon library

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  className,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <form className="relative w-full">
      {/* Search Icon */}
      <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />

      {/* Input with padding to avoid overlap with icon */}
      <Input
        type="search"
        value={value}
        onChange={handleInputChange}
        placeholder="Search..."
        className={`pl-8 ${className}`} // Add left padding to prevent overlap with icon
      />
    </form>
  );
};

export default SearchBar;
