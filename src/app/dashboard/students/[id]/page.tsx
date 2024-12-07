"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Student } from "@/types/Student";
import { getStudent } from "@/services/studentService";

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [contractExists, setContractExists] = useState<boolean>(false);
  const router = useRouter();

  // Params auflösen und ID setzen
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  // Daten abrufen, wenn die ID verfügbar ist
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) return;

      try {
        const studentData = await getStudent(Number(id));
        setStudent(studentData);

        // Prüfen, ob der Vertrag existiert
        const fileName = `${studentData.lastName}_${studentData.firstName}_Ausbildungsvertrag.xlsx`;
        const response = await fetch(`/assets/generated/Ausbildungsvertrag/${fileName}`);
        if (response.ok) {
          setContractExists(true);
        }
      } catch (error) {
        console.error("Fehler beim Laden des Schülers oder Vertrags:", error);
      }
    };

    fetchStudentData();
  }, [id]);

  const handleGenerateOrOpenContract = async () => {
    if (!student) return;
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

      const data = await response.json();
      if (data.url) {
        setContractExists(true);
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Fehler beim Generieren oder Öffnen des Vertrags:", error);
    }
  };

  if (!student) return <p>Lädt...</p>;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => router.push("/dashboard/students")}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mb-4"
      >
        Zurück zur Liste
      </button>

      <h1 className="text-2xl font-bold mb-4">
        {student.firstName} {student.lastName}
      </h1>
      <p><strong>Adresse:</strong> {student.address}</p>
      <p><strong>Postleitzahl:</strong> {student.postalCode}</p>
      <p><strong>Telefon:</strong> {student.phone}</p>
      <p><strong>E-Mail:</strong> {student.email}</p>
      <p><strong>Nationalität:</strong> {student.nationality}</p>
      <p><strong>Fahrstunden:</strong> {student.lessons}</p>

      <div className="mt-6 space-x-4">
        <button
          onClick={handleGenerateOrOpenContract}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {contractExists ? "Ausbildungsvertrag öffnen" : "Ausbildungsvertrag erstellen"}
        </button>
      </div>
    </div>
  );
}
