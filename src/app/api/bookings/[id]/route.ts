import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT: Bestehende Buchung aktualisieren
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id, 10);
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    // Daten aus der Anfrage parsen
    const data = await request.json();

    // Existierende Buchung prüfen
    const existingBooking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!existingBooking) {
      return NextResponse.json({ error: "Buchung nicht gefunden" }, { status: 404 });
    }

    // Buchung aktualisieren
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        start: new Date(data.start),
        end: new Date(data.end),
        studentId: parseInt(data.studentId, 10),
        instructorId: parseInt(data.instructorId, 10),
        carId: parseInt(data.carId, 10),
        description: data.description || null,
        lessonType: data.lessonType,
        paid: data.paid,
      },
    });

    // Anpassung der Fahrstunden, falls der lessonType geändert wurde
    if (existingBooking.lessonType !== data.lessonType) {
      const studentId = parseInt(data.studentId, 10);

      if (existingBooking.lessonType === "NORMAL") {
        await prisma.student.update({
          where: { id: studentId },
          data: { lessons: { decrement: 1 } },
        });
      } else if (data.lessonType === "NORMAL") {
        await prisma.student.update({
          where: { id: studentId },
          data: { lessons: { increment: 1 } },
        });
      }

      // Spezialfahrten aktualisieren
      const specialTripsUpdate: Partial<{
        landstrasse: boolean;
        autobahn: boolean;
        daemmerung: boolean;
      }> = {};
      if (data.lessonType === "LANDSTRASSE") {
        specialTripsUpdate.landstrasse = true;
      } else if (data.lessonType === "AUTOBAHN") {
        specialTripsUpdate.autobahn = true;
      } else if (data.lessonType === "DAEMMERUNG") {
        specialTripsUpdate.daemmerung = true;
      }

      await prisma.student.update({
        where: { id: studentId },
        data: { specialTrips: { ...specialTripsUpdate } },
      });
    }

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Buchung:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler beim Aktualisieren der Buchung" },
      { status: 500 }
    );
  }
}

// DELETE: Buchung löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id, 10);

    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    // Bestehende Buchung prüfen
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return NextResponse.json({ error: "Buchung nicht gefunden" }, { status: 404 });
    }

    // Buchung löschen
    await prisma.booking.delete({ where: { id: bookingId } });

    // Fahrstunden anpassen, falls es sich um eine normale Fahrstunde handelt
    if (booking.lessonType === "NORMAL") {
      await prisma.student.update({
        where: { id: booking.studentId },
        data: { lessons: { decrement: 1 } },
      });
    }

    return NextResponse.json(
      { message: "Buchung erfolgreich gelöscht" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fehler beim Löschen der Buchung:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler beim Löschen der Buchung" },
      { status: 500 }
    );
  }
}