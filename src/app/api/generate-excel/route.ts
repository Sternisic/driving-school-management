import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const studentData = await req.json();

    // Pfade definieren
    const contractTemplatePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "templates",
      "vertrag.xlsx"
    );
    const recordTemplatePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "templates",
      "nachweis.xlsx"
    );

    const contractDir = path.join(
      process.cwd(),
      "public",
      "assets",
      "generated",
      "Ausbildungsvertrag"
    );
    const recordDir = path.join(
      process.cwd(),
      "public",
      "assets",
      "generated",
      "Ausbildungsnachweis"
    );

    const contractFileName = `${studentData.lastName}_${studentData.firstName}_Ausbildungsvertrag.xlsx`;
    const recordFileName = `${studentData.lastName}_${studentData.firstName}_Ausbildungsnachweis.xlsx`;

    const contractSavePath = path.join(contractDir, contractFileName);
    const recordSavePath = path.join(recordDir, recordFileName);

    // 1. Ausbildungsvertrag erstellen
    if (!fs.existsSync(contractSavePath)) {
      console.log("Erstelle Ausbildungsvertrag...");
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(contractTemplatePath);

      const sheet = workbook.getWorksheet(1);
      if (!sheet) {
        throw new Error("Arbeitsblatt für Ausbildungsvertrag nicht gefunden.");
      }

      // Daten in den Vertrag eintragen
      sheet.getCell("D16").value = studentData.lastName;
      sheet.getCell("D18").value = studentData.firstName;
      sheet.getCell("D20").value = studentData.address;
      sheet.getCell("D22").value = studentData.postalCode;
      sheet.getCell("D24").value = studentData.birthDate
        ? new Date(studentData.birthDate).toLocaleDateString("de-DE")
        : "";
      sheet.getCell("M8").value = studentData.phone;
      sheet.getCell("M10").value = studentData.email;
      sheet.getCell("M12").value = studentData.birthPlace;
      sheet.getCell("M14").value = studentData.nationality;
      sheet.getCell("M16").value = studentData.occupation;
      sheet.getCell("L20").value = studentData.currentDate;

      // Ordner erstellen, falls nicht vorhanden
      if (!fs.existsSync(contractDir)) {
        fs.mkdirSync(contractDir, { recursive: true });
      }

      await workbook.xlsx.writeFile(contractSavePath);
      console.log("Ausbildungsvertrag erstellt:", contractSavePath);
    }

    // 2. Ausbildungsnachweis erstellen
    if (!fs.existsSync(recordSavePath)) {
      console.log("Erstelle Ausbildungsnachweis...");
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(recordTemplatePath);

      const sheet = workbook.getWorksheet(1);
      if (!sheet) {
        throw new Error("Arbeitsblatt für Ausbildungsnachweis nicht gefunden.");
      }

      // Daten in den Nachweis eintragen
      sheet.getCell("D4").value = studentData.lastName;
      sheet.getCell("D6").value = studentData.firstName;
      sheet.getCell("D8").value = studentData.address;
      sheet.getCell("D10").value = studentData.postalCode;
      sheet.getCell("D12").value = studentData.birthDate
        ? new Date(studentData.birthDate).toLocaleDateString("de-DE")
        : "";

      // Ordner erstellen, falls nicht vorhanden
      if (!fs.existsSync(recordDir)) {
        fs.mkdirSync(recordDir, { recursive: true });
      }

      await workbook.xlsx.writeFile(recordSavePath);
      console.log("Ausbildungsnachweis erstellt:", recordSavePath);
    }

    // Rückgabe der Vertrags-URL
    return NextResponse.json({ url: `/assets/generated/Ausbildungsvertrag/${contractFileName}` });
  } catch (error) {
    console.error("Fehler beim Generieren des Excel-Dokuments:", error);
    return NextResponse.json({ error: "Fehler beim Generieren des Excel-Dokuments" }, { status: 500 });
  }
}
