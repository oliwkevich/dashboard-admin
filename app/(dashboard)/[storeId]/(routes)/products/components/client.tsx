"use client";
import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, ProductColumn } from "./columns";
import { DataTable } from "@/components/ui/dataTable";
import { ApiList } from "@/components/ui/apiList";

export const ProductClient = ({ data }: { data: ProductColumn[] }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Товари (${data?.length})`}
          desc="Управління товарами для вашого магазину"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/products/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Створити
        </Button>
      </div>
      <Separator />
      <DataTable data={data} columns={columns} searchKey="name" />
      <Heading title="API" desc="API шляхи для товарів" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};
