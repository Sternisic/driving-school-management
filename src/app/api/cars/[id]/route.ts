import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: Auto bearbeiten
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const carId = Number(params.id);
    const data = await req.json();

    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: {
        brand: data.brand, 
        model: data.model,
        licensePlate: data.licensePlate,
        gearType: data.gearType,
      },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error('Fehler beim Bearbeiten des Autos:', error);
    return NextResponse.json({ error: 'Fehler beim Bearbeiten des Autos' }, { status: 500 });
  }
}

// DELETE: Auto löschen
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const carId = Number(params.id);

    if (!carId) {
      return NextResponse.json({ error: 'Ungültige ID' }, { status: 400 });
    }

    const deletedCar = await prisma.car.delete({
      where: { id: carId },
    });

    return NextResponse.json(deletedCar);
  } catch (error) {
    console.error('Fehler beim Löschen des Autos:', error);
    return NextResponse.json({ error: 'Fehler beim Löschen des Autos' }, { status: 500 });
  }
}
