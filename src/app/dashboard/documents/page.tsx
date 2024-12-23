'use client';

import React, { useEffect, useState } from "react";
import { FaDownload, FaPlus } from "react-icons/fa";
import { Student } from "@/types/Student";
import { getStudents } from "@/services/studentService";

interface DocumentStatus {
  contractURL: string | null;
  recordURL: string | null;
}

const DocumentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [documentStatuses, setDocumentStatuses] = useState<Record<number, DocumentStatus>>({});

  // Schüler aus der Datenbank abrufen
  const fetchStudents = async () => {
    try {
      const studentsData = await getStudents();
      setStudents(studentsData);

      // Initiale Dokumenten-Status setzen
      const statuses: Record<number, DocumentStatus> = {};
      for (const student of studentsData) {
        if (student.id) {
          statuses[student.id] = { contractURL: null, recordURL: null };
        }
      }

      setDocumentStatuses(statuses);
    } catch (error) {
      console.error("Fehler beim Laden der Schülerdaten:", error);
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
        const data = await response.json();
        const updatedStatuses = { ...documentStatuses };

        if (student.id) {
          updatedStatuses[student.id] = {
            contractURL: data.contractURL,
            recordURL: data.recordURL,
          };
        }

        setDocumentStatuses(updatedStatuses);
      }
    } catch (error) {
      console.error("Fehler beim Generieren der Dokumente:", error);
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
                {student.id && documentStatuses[student.id]?.contractURL ? (
                  <a
                    ref={documentStatuses[student.id].contractURL}
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
                    onClick={() => handleGenerateDocuments(student)}
                  >
                    <FaPlus className="mr-1" />
                    Generieren
                  </button>
                )}
              </td>
              <td className="p-2 border-t text-black text-sm">
                {student.id && documentStatuses[student.id]?.recordURL ? (
                  <a
                    ref={documentStatuses[student.id].recordURL}
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
