import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: Bestehende Buchung aktualisieren
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const data = await req.json();

    // Vorherige Buchung laden, um lessonType-Änderungen zu erkennen
    const existingBooking = await prisma.booking.findUnique({ where: { id } });
    if (!existingBooking) throw new Error("Buchung nicht gefunden");

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

    // Wenn sich der lessonType ändert, entsprechend die Fahrstunden anpassen
    if (existingBooking.lessonType !== data.lessonType) {
      if (existingBooking.lessonType === "NORMAL") {
        await prisma.student.update({
          where: { id: parseInt(data.studentId, 10) },
          data: { lessons: { decrement: 1 } }, // Fahrstunde zurücksetzen
        });
      } else if (data.lessonType === "NORMAL") {
        await prisma.student.update({
          where: { id: parseInt(data.studentId, 10) },
          data: { lessons: { increment: 1 } },
        });
      }

      // Spezialfahrten aktualisieren, wenn nicht "NORMAL"
      const specialTripsUpdate: any = {};
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
    return NextResponse.json({ error: "Fehler beim Aktualisieren der Buchung" }, { status: 500 });
  }
}

// DELETE: Buchung löschen
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const bookingId = Number(params.id);
    if (!bookingId) return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });

    // Bestehende Buchung laden, um lessonType zu prüfen
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("Buchung nicht gefunden");

    // Buchung löschen
    await prisma.booking.delete({ where: { id: bookingId } });

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
    return NextResponse.json({ error: "Fehler beim Löschen der Buchung" }, { status: 500 });
  }
}
