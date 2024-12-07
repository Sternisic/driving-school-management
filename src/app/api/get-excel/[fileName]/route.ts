import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: Request, { params }: { params: { fileName: string } }) {
  try {
    const { fileName } = params;

    // Pfad zur gespeicherten Datei
    const filePath = path.join(
      process.cwd(),
      "assets",
      "generated",
      "Ausbildungsvertrag",
      fileName
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
    }

    const file = fs.readFileSync(filePath);

    return new Response(file, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Datei:", error);
    return NextResponse.json({ error: "Fehler beim Abrufen der Datei" }, { status: 500 });
  }
}
