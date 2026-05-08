import { NextResponse } from "next/server";
import { hash } from "@node-rs/bcrypt";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim() || null;
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;
    const confirmPassword = body?.confirmPassword;

    if (!email) {
      return NextResponse.json(
        { error: "El email es obligatorio" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "La contraseña es obligatoria" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Las contraseñas no coinciden" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "CUSTOMER" },
      select: { id: true, name: true, email: true, role: true },
    });

    const res = new NextResponse(
      JSON.stringify({ user }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

    const session = await getIronSession(request, res, sessionOptions);
    session.userId = user.id;
    session.email = user.email;
    session.role = user.role;
    await session.save();

    return res;
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return NextResponse.json(
      { error: "Error al crear la cuenta. Intentá de nuevo" },
      { status: 500 }
    );
  }
}
