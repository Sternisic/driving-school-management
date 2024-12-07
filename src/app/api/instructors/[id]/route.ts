import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Überprüfe, ob es Überschneidungen gibt
async function validateBooking(data: any) {
  const overlappingInstructorBooking = await prisma.booking.findFirst({
    where: {
      instructorId: data.instructorId,
      OR: [
        {
          start: { lte: new Date(data.end) },
          end: { gte: new Date(data.start) },
        },
      ],
    },
  });

  if (overlappingInstructorBooking) {
    return "Der Fahrlehrer hat bereits eine Buchung zur gleichen Zeit.";
  }

  const overlappingCarBooking = await prisma.booking.findFirst({
    where: {
      carId: data.carId,
      OR: [
        {
          start: { lte: new Date(data.end) },
          end: { gte: new Date(data.start) },
        },
      ],
    },
  });

  if (overlappingCarBooking) {
    return "Das Auto ist bereits zu dieser Zeit in Verwendung.";
  }

  const overlappingStudentBooking = await prisma.booking.findFirst({
    where: {
      studentId: data.studentId,
      OR: [
        {
          start: { lte: new Date(data.end) },
          end: { gte: new Date(data.start) },
        },
      ],
    },
  });

  if (overlappingStudentBooking) {
    return "Der Fahrschüler hat bereits eine Buchung zur gleichen Zeit.";
  }

  return null;
}

// POST: Neue Buchung hinzufügen
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const validationError = await validateBooking(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        start: new Date(data.start),
        end: new Date(data.end),
        studentId: parseInt(data.studentId, 10),
        instructorId: parseInt(data.instructorId, 10),
        carId: parseInt(data.carId, 10),
        description: data.description || null,
      },
    });

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Buchung:", error);
    return NextResponse.json(
      { error: "Fehler beim Hinzufügen der Buchung" },
      { status: 500 }
    );
  }
}

// PUT: Bestehende Buchung aktualisieren
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id, 10);

    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const data = await req.json();

    const validationError = await validateBooking(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        start: new Date(data.start),
        end: new Date(data.end),
        studentId: parseInt(data.studentId, 10),
        instructorId: parseInt(data.instructorId, 10),
        carId: parseInt(data.carId, 10),
        description: data.description || null,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Buchung:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren der Buchung" },
      { status: 500 }
    );
  }
}

// DELETE: Buchung anhand der ID löschen
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id, 10);

    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const deletedBooking = await prisma.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json(deletedBooking);
  } catch (error) {
    console.error("Fehler beim Löschen der Buchung:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen der Buchung" },
      { status: 500 }
    );
  }
}
