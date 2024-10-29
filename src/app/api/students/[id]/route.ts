import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE: Schüler löschen
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const studentId = Number(params.id);

    if (!studentId) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    // Schüler löschen
    const deletedStudent = await prisma.student.delete({
      where: { id: studentId },
    });

    return NextResponse.json(deletedStudent);
  } catch (error) {
    console.error("Fehler beim Löschen des Schülers:", error);
    return NextResponse.json({ error: "Fehler beim Löschen des Schülers" }, { status: 500 });
  }
}

// PUT: Schüler aktualisieren
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const studentId = Number(params.id);
    const data = await req.json(); // Schülerdaten aus dem Request-Body

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        gearType: data.gearType,
        address: data.address,
        postalCode: data.postalCode, // Neue Felder
        birthDate: new Date(data.birthDate), // Datum in Date-Objekt umwandeln
        birthPlace: data.birthPlace,
        nationality: data.nationality,
        occupation: data.occupation,
        lessons: data.lessons,
        specialTrips: data.specialTrips,
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Fehler beim Bearbeiten des Schülers:', error);
    return NextResponse.json({ error: 'Fehler beim Bearbeiten des Schülers' }, { status: 500 });
  }
}
