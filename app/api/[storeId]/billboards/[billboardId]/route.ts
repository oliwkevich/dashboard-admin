import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!body.label || !body.imageUrl) {
      return new NextResponse("Label and Image URL is required", {
        status: 400,
      });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("You cant change not youre store", {
        status: 403,
      });
    }

    const billboard = await prismadb.billboard.updateMany({
      where: { id: params.billboardId },
      data: { label: body.label, imageUrl: body.imageUrl },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[API] Update Billboard error >>>");
    return new NextResponse("Update Billboard Error", { status: 500 });
  }
}

export async function DELETE(
  _: any,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("You cant remove not youre store", {
        status: 403,
      });
    }

    const bolboard = await prismadb.billboard.deleteMany({
      where: { id: params.billboardId },
    });

    return NextResponse.json(bolboard);
  } catch (error) {
    console.log("[API] Remove Billboard error >>>");
    return new NextResponse("Remove Billboard Error", { status: 500 });
  }
}

export async function GET(
  _: any,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: { id: params.billboardId },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[API] Get Billboard error >>>");
    return new NextResponse("Get Billboard Error", { status: 500 });
  }
}
