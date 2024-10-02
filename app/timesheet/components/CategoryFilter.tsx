import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  setCategoryFilter: (value: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  setCategoryFilter,
}) => {
  const selectedValues = new Set(selectedCategories);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Filter by Category
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  categories
                    .filter((category) => selectedValues.has(category))
                    .map((category) => (
                      <Badge
                        variant="secondary"
                        key={category}
                        className="rounded-sm px-1 font-normal"
                      >
                        {category}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => {
                const isSelected = selectedValues.has(category);
                return (
                  <CommandItem
                    key={category}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(category);
                      } else {
                        selectedValues.add(category);
                      }
                      const updatedSelection = Array.from(selectedValues);
                      setCategoryFilter(updatedSelection);
                    }}
                  >
                    <div
                      className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      }`}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    {category}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setCategoryFilter([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryFilter;
