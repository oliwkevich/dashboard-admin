import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unautorized", { status: 401 });

    if (!body.name || !body.billboardId) {
      return new NextResponse("Category Name and Billboard ID is Required", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is Required", {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("You cant change not youre store", {
        status: 403,
      });
    }

    const category = await prismadb.category.create({
      data: {
        name: body.name,
        billboardId: body.billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[API]: Create category Error >>>", error);
    return new NextResponse("Create category Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is Required", {
        status: 400,
      });
    }

    const categories = await prismadb.category.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[API]: Get categories Error >>>", error);
    return new NextResponse("Get categories Error", { status: 500 });
  }
}
