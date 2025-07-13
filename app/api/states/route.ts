// app/api/states/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const states = await prisma.state.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(states);
}
