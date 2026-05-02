import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";

export async function GET(request) {
  try {
    const session = await getIronSession(request, new NextResponse(), sessionOptions);

    if (!session.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.delete(sessionOptions.cookieName);
      return response;
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("[ME]", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
