import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/colorForm";

export default async function ColorPage({
  params,
}: {
  params: { colorId: string; storeId: string };
}) {
  const color = await prismadb.color.findUnique({
    where: { id: params.colorId },
  });

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm colorData={color} />
      </div>
    </div>
  );
}
