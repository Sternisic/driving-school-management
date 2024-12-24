import { createClient } from "@supabase/supabase-js";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL oder Key sind nicht definiert. Überprüfe die Umgebungsvariablen.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const studentData = await req.json();

    // Pfade zu den Templates
    const contractTemplatePath = path.join(process.cwd(), "assets", "templates", "vertrag.xlsx");
    const recordTemplatePath = path.join(process.cwd(), "assets", "templates", "nachweis.xlsx");

    // Dateinamen für die generierten Dateien
    const contractFileName = `${studentData.lastName}_${studentData.firstName}_Ausbildungsvertrag.xlsx`;
    const recordFileName = `${studentData.lastName}_${studentData.firstName}_Ausbildungsnachweis.xlsx`;

    // 1. Ausbildungsvertrag erstellen
    const contractWorkbook = new ExcelJS.Workbook();

    if (fs.existsSync(contractTemplatePath)) {
      await contractWorkbook.xlsx.readFile(contractTemplatePath);
    } else {
      throw new Error(`Template nicht gefunden: ${contractTemplatePath}`);
    }

    const contractSheet = contractWorkbook.getWorksheet(1);
    if (!contractSheet) {
      throw new Error("Arbeitsblatt im Ausbildungsvertrag-Template nicht gefunden.");
    }

    // Daten in das Template eintragen
    contractSheet.getCell("D16").value = studentData.lastName;
    contractSheet.getCell("D18").value = studentData.firstName;
    contractSheet.getCell("D20").value = studentData.address;
    contractSheet.getCell("D22").value = studentData.postalCode;
    contractSheet.getCell("D24").value = studentData.birthDate
      ? new Date(studentData.birthDate).toLocaleDateString("de-DE")
      : "";
    contractSheet.getCell("M8").value = studentData.phone;
    contractSheet.getCell("M10").value = studentData.email;
    contractSheet.getCell("M12").value = studentData.birthPlace;
    contractSheet.getCell("M14").value = studentData.nationality;
    contractSheet.getCell("M16").value = studentData.occupation;
    contractSheet.getCell("L20").value = studentData.currentDate;

    const contractBuffer = await contractWorkbook.xlsx.writeBuffer();

    // Datei in Supabase hochladen
    const { error: contractError } = await supabase.storage
      .from("generated-files")
      .upload(contractFileName, contractBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: true,
      });

    if (contractError) throw contractError;

    // 2. Ausbildungsnachweis erstellen
    const recordWorkbook = new ExcelJS.Workbook();

    if (fs.existsSync(recordTemplatePath)) {
      await recordWorkbook.xlsx.readFile(recordTemplatePath);
    } else {
      throw new Error(`Template nicht gefunden: ${recordTemplatePath}`);
    }

    const recordSheet = recordWorkbook.getWorksheet(1);
    if (!recordSheet) {
      throw new Error("Arbeitsblatt im Ausbildungsnachweis-Template nicht gefunden.");
    }

    // Daten in das Template eintragen
    recordSheet.getCell("D4").value = studentData.lastName;
    recordSheet.getCell("D6").value = studentData.firstName;
    recordSheet.getCell("D8").value = studentData.address;
    recordSheet.getCell("D10").value = studentData.postalCode;
    recordSheet.getCell("D12").value = studentData.birthDate
      ? new Date(studentData.birthDate).toLocaleDateString("de-DE")
      : "";

    const recordBuffer = await recordWorkbook.xlsx.writeBuffer();

    // Datei in Supabase hochladen
    const { error: recordError } = await supabase.storage
      .from("generated-files")
      .upload(recordFileName, recordBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: true,
      });

    if (recordError) throw recordError;

    // URLs der hochgeladenen Dateien abrufen
    const { data: contractPublicData } = supabase.storage
      .from("generated-files")
      .getPublicUrl(contractFileName);

    const { data: recordPublicData } = supabase.storage
      .from("generated-files")
      .getPublicUrl(recordFileName);

    return new Response(
      JSON.stringify({
        contractURL: contractPublicData?.publicUrl || null,
        recordURL: recordPublicData?.publicUrl || null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Fehler beim Generieren oder Hochladen der Dokumente:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Generieren oder Hochladen der Dokumente" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
