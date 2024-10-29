import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Hinzugefügt: Detaillierte Prisma-Logs
});

// GET: Alle Buchungen abrufen
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        student: true,
        instructor: true,
        car: true,
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Fehler beim Abrufen der Buchungen:', error);
    return NextResponse.json({ error: 'Fehler beim Abrufen der Buchungen' }, { status: 500 });
  }
}

// POST: Neue Buchung hinzufügen
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Request payload:', data);

    // Überprüfe, ob der Student existiert
    const student = await prisma.student.findUnique({
      where: { id: parseInt(data.studentId, 10) },
    });
    if (!student) {
      console.error('Kein Student gefunden mit der ID:', data.studentId);
      return NextResponse.json({ error: `Kein Student mit ID ${data.studentId} gefunden` }, { status: 400 });
    }

    // Überprüfe, ob der Instructor existiert
    const instructor = await prisma.instructor.findUnique({
      where: { id: parseInt(data.instructorId, 10) },
    });
    if (!instructor) {
      console.error('Kein Instructor gefunden mit der ID:', data.instructorId);
      return NextResponse.json({ error: `Kein Instructor mit ID ${data.instructorId} gefunden` }, { status: 400 });
    }

    // Überprüfe, ob das Auto existiert
    const car = await prisma.car.findUnique({
      where: { id: parseInt(data.carId, 10) },
    });
    if (!car) {
      console.error('Kein Auto gefunden mit der ID:', data.carId);
      return NextResponse.json({ error: `Kein Auto mit ID ${data.carId} gefunden` }, { status: 400 });
    }

    // Erstelle die Buchung
    const newBooking = await prisma.booking.create({
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

    console.log('Neue Buchung erfolgreich erstellt:', newBooking);


    console.log('Neue Buchung erfolgreich erstellt:', newBooking); // Debug: Protokolliere die erstellte Buchung

    // Aktualisiere den Schüler je nach Art der Fahrstunde
    if (data.lessonType === 'NORMAL') {
      // Normale Fahrstunde: Erhöhe die Anzahl der Fahrstunden
      await prisma.student.update({
        where: { id: parseInt(data.studentId, 10) },
        data: { lessons: { increment: 1 } },
      });
      console.log('Fahrstunden für den Schüler erhöht'); // Debug: Protokolliere die Erhöhung der Fahrstunden
    } else {
      // Spezialfahrten: Update der specialTrips
      const student = await prisma.student.findUnique({
        where: { id: parseInt(data.studentId, 10) },
      });

      if (student) {
        console.log('Student gefunden:', student); // Debug: Protokolliere den gefundenen Schüler

        // Stelle sicher, dass specialTrips als JavaScript-Objekt vorliegt
        let specialTripsUpdate = student.specialTrips as Record<string, boolean>;

        // Initialisiere das Objekt, falls es noch nicht existiert
        specialTripsUpdate = specialTripsUpdate || {};

        // Aktualisiere das richtige Feld basierend auf der Art der Fahrstunde
        if (data.lessonType === 'LANDSTRASSE') {
          specialTripsUpdate.landstrasse = true;
        } else if (data.lessonType === 'AUTOBAHN') {
          specialTripsUpdate.autobahn = true;
        } else if (data.lessonType === 'DAEMMERUNG') {
          specialTripsUpdate.daemmerung = true;
        }

        console.log('Aktualisierte Spezialfahrten:', specialTripsUpdate); // Debug: Protokolliere die aktualisierten Spezialfahrten

        // Speichere die aktualisierten Spezialfahrten wieder als JSON in der Datenbank
        await prisma.student.update({
          where: { id: parseInt(data.studentId, 10) },
          data: { specialTrips: specialTripsUpdate }, // Speichere das aktualisierte Objekt direkt
        });

        console.log('Spezialfahrten erfolgreich aktualisiert'); // Debug: Protokolliere die erfolgreiche Aktualisierung
      } else {
        console.error('Kein Schüler gefunden mit der ID:', data.studentId); // Debug: Kein Schüler gefunden
      }
    }

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Buchung:', error); // Debug: Protokolliere den genauen Fehler
    return NextResponse.json({ error: 'Fehler beim Hinzufügen der Buchung', details: error }, { status: 500 });
  }
}
