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

interface BillingFilterProps {
  billingTypes: string[];
  selectedBillingTypes: string[];
  setBillingFilter: (value: string[]) => void;
}

const BillingFilter: React.FC<BillingFilterProps> = ({
  billingTypes,
  selectedBillingTypes,
  setBillingFilter,
}) => {
  const selectedValues = new Set(selectedBillingTypes);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Filter by Billing Type
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
                  billingTypes
                    .filter((type) => selectedValues.has(type))
                    .map((type) => (
                      <Badge
                        variant="secondary"
                        key={type}
                        className="rounded-sm px-1 font-normal"
                      >
                        {type}
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
          <CommandInput placeholder="Search billing type..." />
          <CommandList>
            <CommandEmpty>No billing types found.</CommandEmpty>
            <CommandGroup>
              {billingTypes.map((type) => {
                const isSelected = selectedValues.has(type);
                return (
                  <CommandItem
                    key={type}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(type);
                      } else {
                        selectedValues.add(type);
                      }
                      const updatedSelection = Array.from(selectedValues);
                      setBillingFilter(updatedSelection);
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
                    {type}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setBillingFilter([])}
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

export default BillingFilter;
