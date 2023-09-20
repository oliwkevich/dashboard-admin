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

    if (!body.name || !body.value) {
      return new NextResponse("Color Name and Value is Required", {
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

    const color = await prismadb.color.create({
      data: {
        name: body.name,
        value: body.value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[API]: Create color Error >>>", error);
    return new NextResponse("Create color Error", { status: 500 });
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

    const color = await prismadb.color.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[API]: Get color Error >>>", error);
    return new NextResponse("Get color Error", { status: 500 });
  }
}
