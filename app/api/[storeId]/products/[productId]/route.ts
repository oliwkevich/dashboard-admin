import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!name || !price || !categoryId || !colorId || !sizeId || !images) {
      return new NextResponse("Missing some required props", {
        status: 400,
      });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("You cant change not youre store", {
        status: 403,
      });
    }

    await prismadb.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        colorId,
        images: {
          deleteMany: {},
        },
        isArchived,
        isFeatured,
        sizeId,
        storeId: params.storeId,
      },
    });

    const product = await prismadb.product.update({
      where: { id: params.productId },
      data: {
        images: {
          createMany: {
            data: [...images],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[API] Update product error >>>");
    return new NextResponse("Update product Error", { status: 500 });
  }
}

export async function DELETE(
  _: any,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("You cant remove not youre store", {
        status: 403,
      });
    }

    const product = await prismadb.product.deleteMany({
      where: { id: params.productId },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[API] Remove product error >>>");
    return new NextResponse("Remove product Error", { status: 500 });
  }
}

export async function GET(
  _: any,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[API] Get product error >>>");
    return new NextResponse("Get product Error", { status: 500 });
  }
}
