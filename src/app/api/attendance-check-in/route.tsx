import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { sessionId, studentId } = await req.json();

    if (!sessionId || !studentId) {
      return NextResponse.json({ error: "Session-ID und Schüler-ID sind erforderlich." }, { status: 400 });
    }

    // Prüfen, ob der Schüler bereits eingecheckt ist
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        sessionId: Number(sessionId),
        studentId: Number(studentId),
      },
    });

    if (existingAttendance) {
      return NextResponse.json({ message: "Schüler bereits eingecheckt." }, { status: 400 });
    }

    // Anwesenheit speichern
    const attendance = await prisma.attendance.create({
      data: {
        sessionId: Number(sessionId),
        studentId: Number(studentId),
        attendedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Anwesenheit erfolgreich erfasst.", attendance });
  } catch (error) {
    console.error("Fehler beim Einchecken für die Unterrichtseinheit:", error);
    return NextResponse.json(
      { error: "Fehler beim Einchecken für die Unterrichtseinheit." },
      { status: 500 }
    );
  }
}
