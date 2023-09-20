"use client";

import { useOrigin } from "@/hooks/useOrigin";
import { useParams } from "next/navigation";
import { FC } from "react";
import { ApiAlert } from "./apiAlert";
import { Separator } from "./separator";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

export const ApiList: FC<ApiListProps> = ({ entityIdName, entityName }) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        desc={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        desc={`${baseUrl}/${entityName}/<${entityIdName}>`}
      />
      <Separator />
      <ApiAlert
        title="POST"
        variant="admin"
        desc={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        desc={`${baseUrl}/${entityName}/<${entityIdName}>`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        desc={`${baseUrl}/${entityName}/<${entityIdName}>`}
      />
    </>
  );
};
