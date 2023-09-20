import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

export default async function OrdersPage({
  params,
}: {
  params: { storeId: string };
}) {
  const orders = await prismadb.order.findMany({
    where: { storeId: params.storeId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    createdAt: format(order.createdAt, "do MMMM, yyyy"),
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      order.orderItems.reduce((total, orderItem) => {
        return total + Number(orderItem.product.price);
      }, 0)
    ),
    isPaid: order.isPaid,
  }));

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
}
