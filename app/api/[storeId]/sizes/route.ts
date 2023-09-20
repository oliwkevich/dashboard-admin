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
      return new NextResponse("Size Name and Value is Required", {
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

    const size = await prismadb.size.create({
      data: {
        name: body.name,
        value: body.value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[API]: Create size Error >>>", error);
    return new NextResponse("Create size Error", { status: 500 });
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

    const sizes = await prismadb.size.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[API]: Get sizes Error >>>", error);
    return new NextResponse("Get sizes Error", { status: 500 });
  }
}
