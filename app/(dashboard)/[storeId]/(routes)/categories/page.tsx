import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

export default async function CategoriesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
    include: {
      billboard: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    createdAt: format(category.createdAt, "do MMMM, yyyy"),
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
}
