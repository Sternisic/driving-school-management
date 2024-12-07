import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";

export async function POST(req: Request) {
  try {
    const lessonData = await req.json();

    const saveDir = path.join(
      process.cwd(),
      "public",
      "assets",
      "generated",
      "Ausbildungsnachweis"
    );
    const fileName = `${lessonData.lastName}_${lessonData.firstName}_Ausbildungsnachweis.xlsx`;
    const savePath = path.join(saveDir, fileName);

    if (!fs.existsSync(savePath)) {
      return NextResponse.json({ error: "Ausbildungsnachweis nicht gefunden." }, { status: 404 });
    }

    // Excel-Datei laden
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(savePath);
    const sheet = workbook.getWorksheet(1);

    if (!sheet) {
      throw new Error("Arbeitsblatt nicht gefunden.");
    }

    // Freie Zeile finden
    let rowIndex = 16;
    while (sheet.getCell(`J${rowIndex}`).value) {
      rowIndex++;
    }

    sheet.getCell(`J${rowIndex}`).value = lessonData.lessonDate || ""; // Datum
    sheet.getCell(`K${rowIndex}`).value = lessonData.lessonType || ""; // Art der Fahrstunde
    sheet.getCell(`L${rowIndex}`).value = lessonData.startTime || ""; // Beginn
    sheet.getCell(`M${rowIndex}`).value = lessonData.minutes || 0; // Minuten

    await workbook.xlsx.writeFile(savePath);

    return NextResponse.json({ message: "Fahrstunde erfolgreich hinzugefügt." });
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Fahrstunde:", error);
    return NextResponse.json({ error: "Fehler beim Hinzufügen der Fahrstunde" }, { status: 500 });
  }
}
