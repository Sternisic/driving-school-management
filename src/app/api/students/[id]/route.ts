import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Schülerdaten abrufen (GET)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = parseInt(id, 10);

    if (isNaN(studentId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Schüler nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Fehler beim Abrufen des Schülers:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen des Schülers" },
      { status: 500 }
    );
  }
}

// DELETE: Schüler löschen
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = parseInt(id, 10);

    if (isNaN(studentId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const deletedStudent = await prisma.student.delete({
      where: { id: studentId },
    });

    return NextResponse.json(deletedStudent);
  } catch (error) {
    console.error("Fehler beim Löschen des Schülers:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Schülers" },
      { status: 500 }
    );
  }
}

// PUT: Schüler aktualisieren
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentId = parseInt(id, 10);

    if (isNaN(studentId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const data = await req.json();

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        gearType: data.gearType,
        address: data.address,
        postalCode: data.postalCode,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        birthPlace: data.birthPlace,
        nationality: data.nationality,
        occupation: data.occupation,
        lessons: data.lessons || 0,
        specialTrips: data.specialTrips || {},
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Fehler beim Bearbeiten des Schülers:", error);
    return NextResponse.json(
      { error: "Fehler beim Bearbeiten des Schülers" },
      { status: 500 }
    );
  }
}
