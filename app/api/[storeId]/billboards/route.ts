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

    if (!body.label || !body.imageUrl) {
      return new NextResponse("Store Label and Image Url is Required", {
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

    const billboard = await prismadb.billboard.create({
      data: {
        label: body.label,
        imageUrl: body.imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[API]: Create Billboard Error >>>", error);
    return new NextResponse("Create Billboard Error", { status: 500 });
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

    const billboards = await prismadb.billboard.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[API]: Get Billboard Error >>>", error);
    return new NextResponse("Get Billboard Error", { status: 500 });
  }
}
