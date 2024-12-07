'use client';

import React, { useEffect, useState } from "react";
import { getStudents } from "@/services/studentService";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

const SessionAttendancePage = ({ sessionId }: { sessionId: string }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsData = await getStudents();
      setStudents(studentsData);
    };
    fetchStudents();
  }, []);

  const handleCheckIn = async () => {
    try {
      const response = await fetch("/api/attendance-check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, studentId: selectedStudent }),
      });

      if (response.ok) {
        setHasCheckedIn(true);
      } else {
        alert("Fehler beim Einchecken.");
      }
    } catch (error) {
      console.error("Fehler beim Einchecken:", error);
    }
  };

  if (hasCheckedIn) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Danke für die Anmeldung!</h1>
        <p className="text-gray-700">Deine Anwesenheit wurde erfolgreich registriert.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-black mb-6">Einchecken für Unterrichtseinheit</h1>
      <div className="mb-4">
        <label className="block text-sm font-bold text-black mb-2">Wähle deinen Namen:</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="border p-2 rounded w-full  text-black"
        >
          <option value="" disabled>Wähle einen Schüler...</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleCheckIn}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={!selectedStudent}
      >
        Einchecken
      </button>
    </div>
  );
};

export default SessionAttendancePage;
