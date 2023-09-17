import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unautorized", { status: 401 });

    if (!body.name)
      return new NextResponse("Store Name is Required", { status: 400 });

    const store = await prismadb.store.create({
      data: {
        userId,
        name: body.name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[API]: Create Store Error >>>", error);
    return new NextResponse("Create Store Error", { status: 500 });
  }
}
