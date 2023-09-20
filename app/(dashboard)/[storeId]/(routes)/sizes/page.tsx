import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { SizeClient } from "./components/client";
import { SizeColumn } from "./components/columns";

export default async function SizesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "asc" },
  });

  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    createdAt: format(size.createdAt, "do MMMM, yyyy"),
    id: size.id,
    name: size.name,
    value: size.value,
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
}
