import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendResetEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Si el email existe, recibirás instrucciones para restablecer tu contraseña" },
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Si el email existe, recibirás instrucciones para restablecer tu contraseña" },
        { status: 200 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });

    const origin = request.headers.get("origin") ||
      request.headers.get("referer")?.replace(/\/$/, "") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    await sendResetEmail(user.email, token, origin);

    return NextResponse.json(
      { message: "Si el email existe, recibirás instrucciones para restablecer tu contraseña" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FORGOT PASSWORD ERROR]", error);
    return NextResponse.json(
      { message: "Si el email existe, recibirás instrucciones para restablecer tu contraseña" },
      { status: 200 }
    );
  }
}
