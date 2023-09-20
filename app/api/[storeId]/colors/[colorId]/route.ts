import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!body.name || !body.value) {
      return new NextResponse("Name and Value Id is required", {
        status: 400,
      });
    }

    if (!params.colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("You cant change not youre store", {
        status: 403,
      });
    }

    const color = await prismadb.color.updateMany({
      where: { id: params.colorId },
      data: { name: body.name, value: body.value },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[API] Update color error >>>");
    return new NextResponse("Update color Error", { status: 500 });
  }
}

export async function DELETE(
  _: any,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("You cant remove not youre store", {
        status: 403,
      });
    }

    const color = await prismadb.color.deleteMany({
      where: { id: params.colorId },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[API] Remove color error >>>");
    return new NextResponse("Remove color Error", { status: 500 });
  }
}

export async function GET(_: any, { params }: { params: { colorId: string } }) {
  try {
    if (!params.colorId) {
      return new NextResponse("color ID is required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: { id: params.colorId },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[API] Get color error >>>");
    return new NextResponse("Get color Error", { status: 500 });
  }
}
