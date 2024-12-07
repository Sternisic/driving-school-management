import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Alle Schüler abrufen
export async function GET() {
  try {
    const students = await prisma.student.findMany(); // Alle Schüler abrufen
    return NextResponse.json(students);
  } catch (error) {
    console.error("Fehler beim Abrufen der Schüler:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Schüler" },
      { status: 500 }
    );
  }
}

// POST: Schüler hinzufügen
export async function POST(req: NextRequest) {
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
        postalCode: data.postalCode, // Neue Felder hinzufügen
        birthDate: data.birthDate ? new Date(data.birthDate) : null, // Datum in Date-Objekt umwandeln
        birthPlace: data.birthPlace,
        nationality: data.nationality,
        occupation: data.occupation,
        lessons: data.lessons || 0, // Standardwert 0, falls nicht angegeben
        specialTrips: data.specialTrips || {}, // Standardwert leeres Objekt, falls nicht angegeben
      },
    });

    return NextResponse.json(newStudent);
  } catch (error) {
    console.error("Fehler beim Hinzufügen eines Schülers:", error);
    return NextResponse.json(
      { error: "Fehler beim Hinzufügen eines Schülers" },
      { status: 500 }
    );
  }
}
