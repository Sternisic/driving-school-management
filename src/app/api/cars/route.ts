import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Alle Autos abrufen
export async function GET() {
  try {
    const cars = await prisma.car.findMany();
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Fehler beim Abrufen der Autos:', error);
    return NextResponse.json({ error: 'Fehler beim Abrufen der Autos' }, { status: 500 });
  }
}

// POST: Auto hinzufügen
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newCar = await prisma.car.create({
      data: {
        brand: data.brand, 
        model: data.model,
        licensePlate: data.licensePlate,
        gearType: data.gearType,
      },
    });
    return NextResponse.json(newCar);
  } catch (error) {
    console.error('Fehler beim Hinzufügen eines Autos:', error);
    return NextResponse.json({ error: 'Fehler beim Hinzufügen eines Autos' }, { status: 500 });
  }
}
