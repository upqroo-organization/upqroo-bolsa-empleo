import { NextResponse } from "next/server";
import { sendEmailDirect } from "@/lib/emailService";

export async function POST(req: Request) {
  try {
    const emailOptions = await req.json();
    const result = await sendEmailDirect(emailOptions);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Mail API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}