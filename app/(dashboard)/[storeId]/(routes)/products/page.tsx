import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

export default async function ProductsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    include: {
      category: true,
      color: true,
      size: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    createdAt: format(product.createdAt, "do MMMM, yyyy"),
    id: product.id,
    name: product.name,
    isArchived: product.isArchived,
    isFeatured: product.isFeatured,
    price: formatter.format(product.price.toNumber()),
    category: product.category.name,
    color: product.color.name,
    size: product.size.name,
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}
