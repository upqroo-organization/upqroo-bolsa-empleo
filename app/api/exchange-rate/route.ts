import { NextResponse } from "next/server";
import { getUsdMxnRate } from "@/lib/banxico";

export async function GET() {
  try {
    const rate = await getUsdMxnRate();
    return NextResponse.json({ rate });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch exchange rate" }, { status: 500 });
  }
}
