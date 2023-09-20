import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ColorColumn } from "./components/columns";
import { ColorClient } from "./components/client";

export default async function ColorsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "asc" },
  });

  const formattedColors: ColorColumn[] = colors.map((color) => ({
    createdAt: format(color.createdAt, "do MMMM, yyyy"),
    id: color.id,
    name: color.name,
    value: color.value,
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
}
