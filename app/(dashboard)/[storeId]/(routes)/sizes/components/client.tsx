"use client";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/dataTable";
import { ApiList } from "@/components/ui/apiList";

export const SizeClient = ({ data }: { data: SizeColumn[] }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Розміри (${data?.length})`}
          desc="Управління розмірами для вашого магазина"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Створити
        </Button>
      </div>
      <Separator />
      <DataTable data={data} columns={columns} searchKey="name" />
      <Heading title="API" desc="API шляхи для розмірів" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};
