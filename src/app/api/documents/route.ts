import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Dokument-Typ definieren
interface Document {
  name: string; // Name des Schülers
  contract?: string; // Pfad zum Ausbildungsvertrag
  record?: string; // Pfad zum Ausbildungsnachweis
}

export async function GET() {
  try {
    // Verzeichnisse definieren
    const contractsDir = path.join(
      process.cwd(),
      "public",
      "assets",
      "generated",
      "Ausbildungsvertrag"
    );
    const recordsDir = path.join(
      process.cwd(),
      "public",
      "assets",
      "generated",
      "Ausbildungsnachweis"
    );

    // Dateien aus beiden Verzeichnissen abrufen
    const contracts = fs.existsSync(contractsDir)
      ? fs.readdirSync(contractsDir)
      : [];
    const records = fs.existsSync(recordsDir)
      ? fs.readdirSync(recordsDir)
      : [];

    // Kombinieren der Daten
    const allStudents = Array.from(
      new Set([
        ...contracts.map(file => file.replace(/_Ausbildungsvertrag\.xlsx$/, "")),
        ...records.map(file => file.replace(/_Ausbildungsnachweis\.xlsx$/, ""))
      ])
    );

    const documents: Document[] = allStudents.map(name => ({
      name,
      contract: contracts.find(file =>
        file.startsWith(name)
      )
        ? `/assets/generated/Ausbildungsvertrag/${contracts.find(file =>
            file.startsWith(name)
          )}`
        : undefined,
      record: records.find(file =>
        file.startsWith(name)
      )
        ? `/assets/generated/Ausbildungsnachweis/${records.find(file =>
            file.startsWith(name)
          )}`
        : undefined
    }));

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Fehler beim Abrufen der Dokumente:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Dokumente" },
      { status: 500 }
    );
  }
}
