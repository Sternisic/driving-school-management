import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    
    // IDs in Integers umwandeln
    const newBooking = await prisma.booking.create({
      data: {
        start: new Date(data.start),
        end: new Date(data.end),
        studentId: parseInt(data.studentId, 10), // Umwandeln in Int
        instructorId: parseInt(data.instructorId, 10), // Umwandeln in Int
        carId: parseInt(data.carId, 10), // Umwandeln in Int
      },
    });

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Buchung:', error);
    return NextResponse.json({ error: 'Fehler beim Hinzufügen der Buchung' }, { status: 500 });
  }
}