import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to } = await req.json();

    if (!to) {
      return NextResponse.json(
        { success: false, error: "Missing 'to' email address" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT!),
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const info = await transporter.sendMail({
      from: `"Prueba Next" <${process.env.SMTP_USER}>`,
      to, // destinatario dinámico
      subject: "Correo dinámico desde Next.js",
      text: "Este correo fue enviado a un destinatario dinámico.",
      html: "<b>Este correo fue enviado a un destinatario dinámico.</b>",
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
