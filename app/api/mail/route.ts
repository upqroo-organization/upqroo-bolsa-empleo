import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST() {
  try {
    // 🔹 crea una cuenta temporal en Ethereal
    const testAccount = await nodemailer.createTestAccount();

    // 🔹 configura el transportador SMTP
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // 🔹 envía el correo
    const info = await transporter.sendMail({
      from: '"Prueba Next" <prueba@example.com>',
      to: "destinatario@example.com",
      subject: "Correo de prueba desde Next.js + Ethereal",
      text: "Este es un correo de prueba enviado con Ethereal Email.",
      html: "<b>Este es un correo de prueba enviado con Ethereal Email.</b>",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
