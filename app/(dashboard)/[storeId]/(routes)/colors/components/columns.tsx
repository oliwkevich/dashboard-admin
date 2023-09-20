"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cellAction";

export type ColorColumn = {
  id: string;
  value: string;
  createdAt: string;
  name: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Назва",
  },
  {
    accessorKey: "value",
    header: "Значення",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Дата",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
