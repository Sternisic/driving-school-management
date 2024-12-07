'use client';

import React, { useEffect, useState } from "react";
import { FaDownload, FaPlus } from "react-icons/fa";
import { Student } from "@/types/Student";
import { getStudents } from "@/services/studentService";

interface DocumentStatus {
  contractExists: boolean;
  recordExists: boolean;
}

const DocumentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [documentStatuses, setDocumentStatuses] = useState<Record<number, DocumentStatus>>({});

  // Alle Schüler aus der Datenbank abrufen
  const fetchStudents = async () => {
    try {
      const studentsData = await getStudents();
      setStudents(studentsData);

      // Initiale Dokumenten-Status für jeden Schüler prüfen
      const statuses: Record<number, DocumentStatus> = {};
      for (const student of studentsData) {
        if (!student.id) continue;

        const contractFileName = `${student.lastName}_${student.firstName}_Ausbildungsvertrag.xlsx`;
        const recordFileName = `${student.lastName}_${student.firstName}_Ausbildungsnachweis.xlsx`;

        const contractExists = await fileExists(`/assets/generated/Ausbildungsvertrag/${contractFileName}`);
        const recordExists = await fileExists(`/assets/generated/Ausbildungsnachweis/${recordFileName}`);

        statuses[student.id] = { contractExists, recordExists };
      }

      setDocumentStatuses(statuses);
    } catch (error) {
      console.error("Fehler beim Laden der Schülerdaten:", error);
    }
  };

  // Hilfsfunktion zum Prüfen, ob eine Datei existiert
  const fileExists = async (filePath: string): Promise<boolean> => {
    const response = await fetch(filePath);
    return response.ok;
  };

  // Ausbildungsvertrag erstellen
  const handleGenerateContract = async (student: Student) => {
    if (!student.id) {
      console.error("Student hat keine gültige ID.");
      return;
    }

    try {
      const response = await fetch(`/api/generate-excel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastName: student.lastName,
          firstName: student.firstName,
          address: student.address,
          postalCode: student.postalCode,
          birthDate: student.birthDate,
          phone: student.phone,
          email: student.email,
          birthPlace: student.birthPlace,
          nationality: student.nationality,
          occupation: student.occupation,
          currentDate: new Date().toLocaleDateString("de-DE"),
        }),
      });

      if (response.ok) {
        const updatedStatuses = { ...documentStatuses };

        // Initialisiere Status, falls er fehlt
        if (student.id && !updatedStatuses[student.id]) {
          updatedStatuses[student.id] = { contractExists: false, recordExists: false };
        }

        if (student.id) {
          updatedStatuses[student.id].contractExists = true;
          updatedStatuses[student.id].recordExists = true; // Ausbildungsnachweis wird ebenfalls erstellt
        }

        setDocumentStatuses(updatedStatuses);
      }
    } catch (error) {
      console.error("Fehler beim Generieren des Ausbildungsvertrags:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
            <tr key={student.id || Math.random()}>
              <td className="p-2 border-t text-black text-sm">{student.firstName}</td>
              <td className="p-2 border-t text-black text-sm">{student.lastName}</td>
              <td className="p-2 border-t text-black text-sm">
                {student.id && documentStatuses[student.id]?.contractExists ? (
                  <a
                    href={`/assets/generated/Ausbildungsvertrag/${student.lastName}_${student.firstName}_Ausbildungsvertrag.xlsx`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 flex items-center"
                  >
                    <FaDownload className="mr-1" />
                    Öffnen
                  </a>
                ) : (
                  <button
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleGenerateContract(student)}
                  >
                    <FaPlus className="mr-1" />
                    Erstellen
                  </button>
                )}
              </td>
              <td className="p-2 border-t text-black text-sm">
                {student.id && documentStatuses[student.id]?.recordExists ? (
                  <a
                    href={`/assets/generated/Ausbildungsnachweis/${student.lastName}_${student.firstName}_Ausbildungsnachweis.xlsx`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 flex items-center"
                  >
                    <FaDownload className="mr-1" />
                    Öffnen
                  </a>
                ) : (
                  <span className="text-gray-500">Kein Nachweis vorhanden</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsPage;
