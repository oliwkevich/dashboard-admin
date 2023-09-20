import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
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

    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("You cant change not youre store", {
        status: 403,
      });
    }

    const size = await prismadb.size.updateMany({
      where: { id: params.sizeId },
      data: { name: body.name, value: body.value },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[API] Update size error >>>");
    return new NextResponse("Update size Error", { status: 500 });
  }
}

export async function DELETE(
  _: any,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("You cant remove not youre store", {
        status: 403,
      });
    }

    const size = await prismadb.size.deleteMany({
      where: { id: params.sizeId },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[API] Remove size error >>>");
    return new NextResponse("Remove size Error", { status: 500 });
  }
}

export async function GET(_: any, { params }: { params: { sizeId: string } }) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: { id: params.sizeId },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[API] Get size error >>>");
    return new NextResponse("Get size Error", { status: 500 });
  }
}
