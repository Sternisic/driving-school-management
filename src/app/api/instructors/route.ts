// src/app/api/instructors/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Alle Fahrlehrer abrufen
export async function GET() {
  try {
    const instructors = await prisma.instructor.findMany();
    return NextResponse.json(instructors);
  } catch (error) {
    console.error("Fehler beim Abrufen der Fahrlehrer:", error);
    return NextResponse.json({ error: "Fehler beim Abrufen der Fahrlehrer" }, { status: 500 });
  }
}

// POST: Fahrlehrer hinzufügen
export async function POST(req: Request) {
  try {
    const data = await req.json(); // Fahrlehrerdaten aus dem Request-Body
    const newInstructor = await prisma.instructor.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    });
    return NextResponse.json(newInstructor);
  } catch (error) {
    console.error("Fehler beim Hinzufügen eines Fahrlehrers:", error);
    return NextResponse.json({ error: "Fehler beim Hinzufügen eines Fahrlehrers" }, { status: 500 });
  }
}
