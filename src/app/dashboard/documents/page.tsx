'use client';

import React, { useEffect, useState } from "react";
import { FaDownload, FaPlus } from "react-icons/fa";
import { Student } from "@/types/Student";
import { getStudents } from "@/services/studentService";
import { createClient } from "@supabase/supabase-js";

// Supabase-Client initialisieren
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface DocumentStatus {
  contractURL: string | null;
  recordURL: string | null;
}

const DocumentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [documentStatuses, setDocumentStatuses] = useState<Record<number, DocumentStatus>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Schüler und Dokumentenstatus abrufen
  const fetchStudentsAndDocuments = async () => {
    try {
      setLoading(true);
  
      const studentsData = await getStudents();
      setStudents(studentsData);
  
      const statuses: Record<number, DocumentStatus> = {};
  
      for (const student of studentsData) {
        if (student.id) {
          const contractFileName = `${student.lastName}_${student.firstName}_Ausbildungsvertrag.xlsx`;
          const recordFileName = `${student.lastName}_${student.firstName}_Ausbildungsnachweis.xlsx`;
  
          // Alle Dateien im Bucket abrufen
          const { data: files, error } = await supabase.storage.from("generated-files").list();
  
          if (error) {
            console.error("Fehler beim Abrufen der Dateien:", error);
            continue;
          }
  
          // Existenz der Dateien prüfen
          const contractExists = files.some((file) => file.name === contractFileName);
          const recordExists = files.some((file) => file.name === recordFileName);
  
          statuses[student.id] = {
            contractURL: contractExists
              ? supabase.storage.from("generated-files").getPublicUrl(contractFileName).data?.publicUrl || null
              : null,
            recordURL: recordExists
              ? supabase.storage.from("generated-files").getPublicUrl(recordFileName).data?.publicUrl || null
              : null,
          };
        }
      }
  
      setDocumentStatuses(statuses);
    } catch (error) {
      console.error("Fehler beim Laden der Schülerdaten oder Dokumentenstatus:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Ausbildungsvertrag und Nachweis generieren
  const handleGenerateDocuments = async (student: Student) => {
    if (!student.id) {
      console.error("Student hat keine gültige ID.");
      return;
    }

    try {
      const response = await fetch(`/api/generate-excel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      if (response.ok) {
        const data: { contractURL: string; recordURL: string } = await response.json();
        const updatedStatuses = { ...documentStatuses };

        updatedStatuses[student.id] = {
          contractURL: data.contractURL,
          recordURL: data.recordURL,
        };

        setDocumentStatuses(updatedStatuses);
      }
    } catch (error) {
      console.error("Fehler beim Generieren der Dokumente:", error);
    }
  };

  // Daten laden
  useEffect(() => {
    fetchStudentsAndDocuments();
  }, []);

  const renderContractButton = (studentId: number) => {
    const status = documentStatuses[studentId];
    if (status?.contractURL) {
      return (
        <a
          href={status.contractURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-800 flex items-center"
        >
          <FaDownload className="mr-1" />
          Öffnen
        </a>
      );
    }
    return (
      <button
        className="text-blue-600 hover:text-blue-800 flex items-center"
        onClick={() => handleGenerateDocuments(students.find((s) => s.id === studentId)!)}
      >
        <FaPlus className="mr-1" />
        Generieren
      </button>
    );
  };

  const renderRecordButton = (studentId: number) => {
    const status = documentStatuses[studentId];
    if (status?.recordURL) {
      return (
        <a
          href={status.recordURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-800 flex items-center"
        >
          <FaDownload className="mr-1" />
          Öffnen
        </a>
      );
    }
    return <span className="text-gray-500">Kein Nachweis vorhanden</span>;
  };

  if (loading) {
    return <p>Lädt...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-black mb-6">Dokumente-Verwaltung</h1>
      <table className="min-w-full bg-white shadow-md rounded table-fixed">
        <thead>
          <tr>
            <th className="p-2 bg-primary text-white text-sm">Vorname</th>
            <th className="p-2 bg-primary text-white text-sm">Nachname</th>
            <th className="p-2 bg-primary text-white text-sm">Ausbildungsvertrag</th>
            <th className="p-2 bg-primary text-white text-sm">Ausbildungsnachweis</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="p-2 border-t text-black text-sm">{student.firstName}</td>
              <td className="p-2 border-t text-black text-sm">{student.lastName}</td>
              <td className="p-2 border-t text-black text-sm">
                {renderContractButton(student.id!)}
              </td>
              <td className="p-2 border-t text-black text-sm">
                {renderRecordButton(student.id!)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsPage;
