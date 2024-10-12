'use client';

import { useEffect, useState } from 'react';
import InstructorList from '@/components/InstructorList';
import { getInstructors, addInstructor, updateInstructor, deleteInstructor } from '@/services/instructorService';
import InstructorForm from '@/components/InstructorForm';
import Modal from '@/components/Modal';
import { Instructor } from '@/types/Instructor';

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fahrlehrer abrufen
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await getInstructors();
        setInstructors(data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Fahrlehrer:', error);
      }
    };
    fetchInstructors();
  }, []);

  // Funktion zum Speichern eines neuen oder bearbeiteten Fahrlehrers
  const handleSaveInstructor = async (instructor: Instructor) => {
    try {
      if (isEditing && instructor.id) {
        // Fahrlehrer aktualisieren
        await updateInstructor(instructor);
      } else {
        // Neuen Fahrlehrer hinzufügen
        await addInstructor(instructor);
      }
      // Modal schließen und Fahrlehrer-Liste aktualisieren
      setIsModalOpen(false);
      setSelectedInstructor(null);
      const data = await getInstructors();
      setInstructors(data);
    } catch (error) {
      console.error('Fehler beim Speichern des Fahrlehrers:', error);
    }
  };

  // Funktion zum Löschen eines Fahrlehrers
  const handleDeleteInstructor = async (id: number) => {
    try {
      await deleteInstructor(id);
      const data = await getInstructors();
      setInstructors(data);
    } catch (error) {
      console.error('Fehler beim Löschen des Fahrlehrers:', error);
    }
  };

  // Funktion zum Bearbeiten eines Fahrlehrers (Modal öffnen)
  const handleEditInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">Fahrlehrer-Verwaltung</h1>

      {/* Fahrlehrerliste */}
      <InstructorList instructors={instructors} onEdit={handleEditInstructor} onDelete={handleDeleteInstructor} />

      {/* Button zum Hinzufügen eines Fahrlehrers */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 fixed bottom-4 right-4 shadow-lg"
        onClick={() => {
          setIsEditing(false);
          setSelectedInstructor(null);
          setIsModalOpen(true); // Modal öffnen
        }}
      >
        Fahrlehrer hinzufügen
      </button>

      {/* Modal für das Formular */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InstructorForm instructor={selectedInstructor} onSave={handleSaveInstructor} />
      </Modal>
    </div>
  );
}