import prismadb from "@/lib/prismadb";

interface GrapthDataProps {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: { storeId, isPaid: true },
    include: { orderItems: { include: { product: true } } },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber();
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const grapthData: GrapthDataProps[] = [
    { name: "Січень", total: 0 },
    { name: "Лютий", total: 0 },
    { name: "Березень", total: 0 },
    { name: "Квітень", total: 0 },
    { name: "Травень", total: 0 },
    { name: "Червень", total: 0 },
    { name: "Липень", total: 0 },
    { name: "Серпень", total: 0 },
    { name: "Вересень", total: 0 },
    { name: "Листопад", total: 0 },
    { name: "Жовтень", total: 0 },
    { name: "Грудень", total: 0 },
  ];

  for (const month in monthlyRevenue) {
    grapthData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return grapthData;
};
