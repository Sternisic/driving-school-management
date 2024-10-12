import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Einzelnen Schüler abrufen
export async function GET() {
    try {
      const students = await prisma.student.findMany(); // Alle Schüler abrufen
      return NextResponse.json(students);
    } catch (error) {
      console.error("Fehler beim Abrufen der Schüler:", error);
      return NextResponse.json({ error: "Fehler beim Abrufen der Schüler" }, { status: 500 });
    }
  }


// POST: Schüler hinzufügen
  export async function POST(req: Request) {
    try {
      const data = await req.json(); // Schülerdaten aus dem Request-Body
      const newStudent = await prisma.student.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          gearType: data.gearType,
          address: data.address,
          lessons: data.lessons,
          specialTrips: data.specialTrips,
        },
      });
      return NextResponse.json(newStudent);
    } catch (error) {
      console.error('Fehler beim Hinzufügen eines Schülers:', error);
      return NextResponse.json({ error: 'Fehler beim Hinzufügen eines Schülers' }, { status: 500 });
    }
  }
  

