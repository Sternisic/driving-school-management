import { NextResponse } from 'next/server';

// Dummy-Daten für Fahrschüler
let students = [
    { id: 1, name: 'Max Mustermann', email: 'max@example.com' },
    { id: 2, name: 'Erika Mustermann', email: 'erika@example.com' },
];

// GET: Alle Fahrschüler abrufen
export async function GET() {
    return NextResponse.json(students);
}

// POST: Einen neuen Fahrschüler erstellen
export async function POST(request: Request) {
    const body = await request.json();
    students.push({ id: students.length + 1, ...body });
    return NextResponse.json({ message: 'Fahrschüler hinzugefügt', student: body });
}
