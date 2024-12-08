import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Instruktordaten abrufen (GET)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const instructorId = parseInt(id, 10);

    if (isNaN(instructorId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const instructor = await prisma.instructor.findUnique({
      where: { id: instructorId },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "Fahrlehrer nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor);
  } catch (error) {
    console.error("Fehler beim Abrufen des Fahrlehrers:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen des Fahrlehrers" },
      { status: 500 }
    );
  }
}

// Fahrlehrer-Daten aktualisieren (PUT)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const instructorId = parseInt(id, 10);

    if (isNaN(instructorId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const data = await req.json();

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
    console.error("Fehler beim Bearbeiten des Fahrlehrers:", error);
    return NextResponse.json(
      { error: "Fehler beim Bearbeiten des Fahrlehrers" },
      { status: 500 }
    );
  }
}

// Fahrlehrer löschen (DELETE)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const instructorId = parseInt(id, 10);

    if (isNaN(instructorId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const deletedInstructor = await prisma.instructor.delete({
      where: { id: instructorId },
    });

    return NextResponse.json(deletedInstructor);
  } catch (error) {
    console.error("Fehler beim Löschen des Fahrlehrers:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Fahrlehrers" },
      { status: 500 }
    );
  }
}
