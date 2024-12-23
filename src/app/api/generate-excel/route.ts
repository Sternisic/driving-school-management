import { createClient } from "@supabase/supabase-js";
import ExcelJS from "exceljs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL oder Key sind nicht definiert. Überprüfe die Umgebungsvariablen.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const studentData = await req.json();

    // Dateinamen für die Dokumente
    const contractFileName = `${studentData.lastName}_${studentData.firstName}_Ausbildungsvertrag.xlsx`;
    const recordFileName = `${studentData.lastName}_${studentData.firstName}_Ausbildungsnachweis.xlsx`;

    // 1. Ausbildungsvertrag erstellen
    const workbookContract = new ExcelJS.Workbook();
    const sheetContract = workbookContract.addWorksheet("Ausbildungsvertrag");

    // Daten in den Vertrag eintragen
    sheetContract.getCell("D16").value = studentData.lastName;
    sheetContract.getCell("D18").value = studentData.firstName;
    sheetContract.getCell("D20").value = studentData.address;
    sheetContract.getCell("D22").value = studentData.postalCode;
    sheetContract.getCell("D24").value = studentData.birthDate
      ? new Date(studentData.birthDate).toLocaleDateString("de-DE")
      : "";
    sheetContract.getCell("M8").value = studentData.phone;
    sheetContract.getCell("M10").value = studentData.email;
    sheetContract.getCell("M12").value = studentData.birthPlace;
    sheetContract.getCell("M14").value = studentData.nationality;
    sheetContract.getCell("M16").value = studentData.occupation;
    sheetContract.getCell("L20").value = studentData.currentDate;

    const contractBuffer = await workbookContract.xlsx.writeBuffer();

    // Datei in Supabase hochladen
    const { data: contractData, error: contractError } = await supabase.storage
      .from("generated-files")
      .upload(contractFileName, contractBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: true,
      });

    if (contractError) throw contractError;

    // 2. Ausbildungsnachweis erstellen
    const workbookRecord = new ExcelJS.Workbook();
    const sheetRecord = workbookRecord.addWorksheet("Ausbildungsnachweis");

    // Daten in den Nachweis eintragen
    sheetRecord.getCell("D4").value = studentData.lastName;
    sheetRecord.getCell("D6").value = studentData.firstName;
    sheetRecord.getCell("D8").value = studentData.address;
    sheetRecord.getCell("D10").value = studentData.postalCode;
    sheetRecord.getCell("D12").value = studentData.birthDate
      ? new Date(studentData.birthDate).toLocaleDateString("de-DE")
      : "";

    const recordBuffer = await workbookRecord.xlsx.writeBuffer();

    // Datei in Supabase hochladen
    const { data: recordData, error: recordError } = await supabase.storage
      .from("generated-files")
      .upload(recordFileName, recordBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: true,
      });

    if (recordError) throw recordError;

    // Öffentliche URLs abrufen
    const { data: contractPublicData } = supabase.storage
      .from("generated-files")
      .getPublicUrl(contractFileName);

    const contractURL = contractPublicData?.publicUrl || "";

    const { data: recordPublicData } = supabase.storage
      .from("generated-files")
      .getPublicUrl(recordFileName);

    const recordURL = recordPublicData?.publicUrl || "";

    if (!contractURL || !recordURL) {
      throw new Error("Fehler beim Abrufen der öffentlichen URLs.");
    }

    // URLs zurückgeben
    return new Response(
      JSON.stringify({
        contractURL,
        recordURL,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Fehler beim Generieren oder Hochladen:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Generieren oder Hochladen der Dateien" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
