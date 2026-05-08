import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";

export async function DELETE(request) {
  try {
    const response = new NextResponse();
    const session = await getIronSession(request, response, sessionOptions);

    if (!session.userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.user.delete({ where: { id: session.userId } });

    response.cookies.delete(sessionOptions.cookieName);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE ACCOUNT]", error);
    return NextResponse.json({ error: "Error al eliminar la cuenta" }, { status: 500 });
  }
}
