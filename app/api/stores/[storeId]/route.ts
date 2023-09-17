import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!body.name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: { userId, id: params.storeId },
      data: { name: body.name },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[API] Update Store settings error >>>");
    return new NextResponse("Update Store Error", { status: 500 });
  }
}

export async function DELETE(
  _: any,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: { userId, id: params.storeId },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[API] Remove Store settings error >>>");
    return new NextResponse("Remove Store Error", { status: 500 });
  }
}
