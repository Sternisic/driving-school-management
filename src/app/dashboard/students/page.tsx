"use client";

import { useState, useEffect } from "react";
import StudentList from "@/components/StudentList";
import StudentForm from "@/components/StudentForm";
import Modal from "@/components/Modal";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "@/services/studentService";
import { Student } from "@/types/Student"; // Importiere den zentralen Student-Typ

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Funktion, um Schüler aus der API abzurufen
  const fetchStudents = async () => {
    const studentsData = await getStudents();
    setStudents(studentsData);
  };

  // Schüler beim ersten Laden der Seite abrufen
  useEffect(() => {
    fetchStudents();
  }, []);

  // Schüler speichern (Hinzufügen oder Bearbeiten)
  const handleSaveStudent = async (student: Student) => {
    if (isEditing && student.id) {
      // Bearbeiten
      await updateStudent(student.id, student);
    } else {
      // Hinzufügen
      await addStudent(student);
    }
    fetchStudents(); // Tabelle nach dem Speichern aktualisieren
    setIsModalOpen(false); // Modal schließen
  };

  // Schüler bearbeiten (ausgewählten Schüler ins Formular laden)
  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditing(true); // Bearbeitungsmodus aktivieren
    setIsModalOpen(true); // Modal öffnen
  };

  // Schüler löschen
  const handleDeleteStudent = async (id: number) => {
    if (window.confirm("Möchtest du diesen Schüler wirklich löschen?")) {
      try {
        await deleteStudent(id);
        fetchStudents(); // Aktualisiere die Liste der Schüler nach dem Löschen
      } catch (error) {
        console.error("Fehler beim Löschen des Schülers:", error);
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">
        Fahrschülerverwaltung
      </h1>

      {/* Tabelle der Fahrschüler */}
      <StudentList
        students={students}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
      />

      {/* Button unten rechts positioniert */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 fixed bottom-4 right-4 shadow-lg"
        onClick={() => {
          setIsEditing(false); // Setzt den Bearbeitungsmodus auf false, um einen neuen Schüler hinzuzufügen
          setSelectedStudent(null); // Leeres Formular für neuen Schüler
          setIsModalOpen(true); // Modal öffnen
        }}
      >
        Fahrschüler hinzufügen
      </button>

      {/* Modal für das Formular */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <StudentForm student={selectedStudent} onSave={handleSaveStudent} />
      </Modal>
    </div>
  );
}
