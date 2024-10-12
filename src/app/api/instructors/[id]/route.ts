// src/app/api/instructors/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: Fahrlehrer aktualisieren
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const instructorId = Number(params.id);
    const data = await req.json(); // Fahrlehrerdaten aus dem Request-Body

    const updatedInstructor = await prisma.instructor.update({
      where: { id: instructorId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    });

    return NextResponse.json(updatedInstructor);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Fahrlehrers:", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Fahrlehrers" }, { status: 500 });
  }
}

// DELETE: Fahrlehrer löschen
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const instructorId = Number(params.id);

    if (!instructorId) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const deletedInstructor = await prisma.instructor.delete({
      where: { id: instructorId },
    });

    return NextResponse.json(deletedInstructor);
  } catch (error) {
    console.error("Fehler beim Löschen des Fahrlehrers:", error);
    return NextResponse.json({ error: "Fehler beim Löschen des Fahrlehrers" }, { status: 500 });
  }
}
