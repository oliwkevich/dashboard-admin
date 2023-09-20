"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cellAction";

export type ProductColumn = {
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  price: string;
  createdAt: string;
  size: string;
  color: string;
  category: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Назва",
  },
  {
    accessorKey: "isArchived",
    header: "В архіві?",
    cell: ({ row }) => <span>{row.original.isArchived ? "Так" : "Ні"}</span>,
  },
  {
    accessorKey: "isFeatured",
    header: "В наявності?",
    cell: ({ row }) => <span>{row.original.isFeatured ? "Так" : "Ні"}</span>,
  },
  {
    accessorKey: "price",
    header: "Ціна",
  },
  {
    accessorKey: "category",
    header: "Категорія",
  },
  {
    accessorKey: "size",
    header: "Розмір",
  },
  {
    accessorKey: "color",
    header: "Колір",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}{" "}
        <div
          className="w-6 h-6 rounded-full border"
          style={{ background: row.original.color }}
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
