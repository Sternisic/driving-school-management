import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT: Bestehende Buchung aktualisieren
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const data = await req.json();

    // Vorherige Buchung laden, um lessonType-Änderungen zu erkennen
    const existingBooking = await prisma.booking.findUnique({ where: { id } });
    if (!existingBooking) {
      return NextResponse.json({ error: "Buchung nicht gefunden" }, { status: 404 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
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

    // Fahrstunden anpassen, wenn sich der lessonType ändert
    if (existingBooking.lessonType !== data.lessonType) {
      if (existingBooking.lessonType === "NORMAL") {
        await prisma.student.update({
          where: { id: parseInt(data.studentId, 10) },
          data: { lessons: { decrement: 1 } },
        });
      } else if (data.lessonType === "NORMAL") {
        await prisma.student.update({
          where: { id: parseInt(data.studentId, 10) },
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
        where: { id: parseInt(data.studentId, 10) },
        data: { specialTrips: { ...specialTripsUpdate } },
      });
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Buchung:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

// DELETE: Buchung löschen
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    // Bestehende Buchung laden, um lessonType zu prüfen
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: "Buchung nicht gefunden" }, { status: 404 });
    }

    // Buchung löschen
    await prisma.booking.delete({ where: { id } });

    // Fahrstunden nur verringern, wenn es sich um eine normale Fahrstunde handelt
    if (booking.lessonType === "NORMAL") {
      await prisma.student.update({
        where: { id: booking.studentId },
        data: { lessons: { decrement: 1 } },
      });
    }

    return NextResponse.json({ message: "Buchung erfolgreich gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen der Buchung:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
