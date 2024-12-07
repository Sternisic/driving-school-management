import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT: Auto bearbeiten
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const carId = Number(id);

    if (isNaN(carId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

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
    console.error("Fehler beim Bearbeiten des Autos:", error);
    return NextResponse.json(
      { error: "Fehler beim Bearbeiten des Autos" },
      { status: 500 }
    );
  }
}

// DELETE: Auto löschen
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const carId = Number(id);

    if (isNaN(carId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const deletedCar = await prisma.car.delete({
      where: { id: carId },
    });

    return NextResponse.json(deletedCar);
  } catch (error) {
    console.error("Fehler beim Löschen des Autos:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Autos" },
      { status: 500 }
    );
  }
}
