"use client";

import { ColumnDef } from "@tanstack/react-table";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  products: string;
  totalPrice: string;
  isPaid: boolean;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Товари",
  },
  {
    accessorKey: "phone",
    header: "Телефон",
  },
  {
    accessorKey: "address",
    header: "Адреса",
  },
  {
    accessorKey: "totalPrice",
    header: "Сума",
  },
  {
    accessorKey: "isPaid",
    header: "Оплачено?",
    cell: ({ row }) => <span>{row.original.isPaid ? "Так" : "Ні"}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Дата",
  },
];
