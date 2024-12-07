import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params;

    // Pfad zur gespeicherten Datei
    const filePath = path.join(
      process.cwd(),
      "assets",
      "generated",
      "Ausbildungsvertrag",
      fileName
    );

    // Prüfen, ob die Datei existiert
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Datei nicht gefunden." },
        { status: 404 }
      );
    }

    // Datei lesen
    const file = fs.readFileSync(filePath);

    // Datei zurückgeben
    return new Response(file, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Datei:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Datei" },
      { status: 500 }
    );
  }
}
