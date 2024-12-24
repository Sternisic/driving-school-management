import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL oder Key sind nicht definiert. Überprüfe die Umgebungsvariablen.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data: contractFiles, error: contractError } = await supabase.storage
      .from("generated-files")
      .list("", {
        search: "_Ausbildungsvertrag.xlsx",
      });

    const { data: recordFiles, error: recordError } = await supabase.storage
      .from("generated-files")
      .list("", {
        search: "_Ausbildungsnachweis.xlsx",
      });

    if (contractError || recordError) {
      console.error("Fehler beim Abrufen der Dateien:", contractError || recordError);
      return NextResponse.json(
        { error: "Fehler beim Abrufen der Dateien aus dem Storage" },
        { status: 500 }
      );
    }

    // Schülernamen extrahieren und kombinieren
    const allStudents = Array.from(
      new Set([
        ...(contractFiles || []).map((file) =>
          file.name.replace(/_Ausbildungsvertrag\.xlsx$/, "")
        ),
        ...(recordFiles || []).map((file) =>
          file.name.replace(/_Ausbildungsnachweis\.xlsx$/, "")
        ),
      ])
    );

    // URLs generieren und kombinieren
    const documents = allStudents.map((name) => ({
      name,
      contract: contractFiles?.find((file) => file.name.startsWith(name))
        ? supabase.storage.from("generated-files").getPublicUrl(`${name}_Ausbildungsvertrag.xlsx`).data
            .publicUrl
        : null,
      record: recordFiles?.find((file) => file.name.startsWith(name))
        ? supabase.storage.from("generated-files").getPublicUrl(`${name}_Ausbildungsnachweis.xlsx`).data
            .publicUrl
        : null,
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
