import { NextResponse } from "next/server";
import { verify } from "@node-rs/bcrypt";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const isValid = await verify(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const res = new NextResponse(
      JSON.stringify({ user: { id: user.id, email: user.email } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

    const session = await getIronSession(request, res, sessionOptions);
    session.userId = user.id;
    session.email = user.email;
    await session.save();

    return res;
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión. Intentá de nuevo" },
      { status: 500 }
    );
  }
}
