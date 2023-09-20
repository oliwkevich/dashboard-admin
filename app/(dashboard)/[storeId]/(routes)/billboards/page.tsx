import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

export default async function BillboardsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "asc" },
  });

  const formattedBilboards: BillboardColumn[] = billboards.map((billboard) => ({
    createdAt: format(billboard.createdAt, "do MMMM, yyyy"),
    id: billboard.id,
    label: billboard.label,
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBilboards} />
      </div>
    </div>
  );
}
