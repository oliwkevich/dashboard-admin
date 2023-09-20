import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboardForm";

export default async function BillboardPage({
  params,
}: {
  params: { billboardId: string };
}) {
  const billboard = await prismadb.billboard.findUnique({
    where: { id: params.billboardId },
  });

  console.log("billboard", billboard);

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm billboardData={billboard} />
      </div>
    </div>
  );
}
