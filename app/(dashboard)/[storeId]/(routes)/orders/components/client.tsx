"use client";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/dataTable";

export const OrderClient = ({ data }: { data: OrderColumn[] }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <Heading
        title={`Замовлення (${data?.length})`}
        desc="Управління Замовленнями вашого магазину"
      />
      <Separator />
      <DataTable data={data} columns={columns} searchKey="products" />
    </>
  );
};
