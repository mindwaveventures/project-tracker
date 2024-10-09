"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { useState } from "react";
import SearchBar from "../../../../components/ui/search";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center justify-between space-x-4">
        <div className="flex w-auto md:w-[500px]">
          <SearchBar
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(value) => table.getColumn("name")?.setFilterValue(value)}
          />
        </div>
        <div className="flex gap-4">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
          {table.getColumn("priority") && (
            <DataTableFacetedFilter
              column={table.getColumn("priority")}
              title="Priority"
              options={priorities}
            />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}
