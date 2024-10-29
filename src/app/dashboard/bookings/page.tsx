'use client';

import { useState, useEffect } from 'react';
import { Booking } from '@/types/Booking';
import { Instructor } from '@/types/Instructor'; // Fahrlehrer-Typ importieren
import { Student } from '@/types/Student'; // Fahrschüler-Typ importieren
import { getBookings, addBooking, updateBooking, deleteBooking } from '@/services/bookingService'; // API-Funktionen
import { getInstructors } from '@/services/instructorService'; // API für Fahrlehrer
import { getStudents } from '@/services/studentService'; // API für Fahrschüler
import CalendarView from '@/components/CalendarView';
import BookingForm from '@/components/BookingForm';
import Modal from '@/components/Modal'; // Modal-Komponente für das Formular

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]); // Zustand für Fahrlehrer
  const [students, setStudents] = useState<Student[]>([]); // Zustand für Fahrschüler
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funktion zum Abrufen der Buchungen
  const fetchBookings = async () => {
    const bookingsData = await getBookings();
    setBookings(bookingsData);
  };

  // Funktion zum Abrufen der Fahrlehrer
  const fetchInstructors = async () => {
    const instructorsData = await getInstructors();
    setInstructors(instructorsData);
  };

  // Funktion zum Abrufen der Fahrschüler
  const fetchStudents = async () => {
    const studentsData = await getStudents();
    setStudents(studentsData);
  };

  // Daten beim ersten Laden abrufen
  useEffect(() => {
    fetchBookings();
    fetchInstructors(); // Fahrlehrer abrufen
    fetchStudents(); // Fahrschüler abrufen
  }, []);

  // Funktion zum Speichern von Buchungen (hinzufügen oder bearbeiten)
  const handleSaveBooking = async (booking: Booking) => {
    if (isEditing && booking.id) {
      await updateBooking(booking.id, booking);
    } else {
      await addBooking(booking);
    }
    fetchBookings(); // Tabelle und Kalender nach dem Speichern aktualisieren
    setIsModalOpen(false); // Modal schließen
  };

  // Funktion zum Bearbeiten einer Buchung
  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditing(true);
    setIsModalOpen(true); // Modal für die Bearbeitung öffnen
  };

  // Funktion zum Löschen einer Buchung
  const handleDeleteBooking = async (id: number) => {
    if (window.confirm('Möchtest du diese Buchung wirklich löschen?')) {
      await deleteBooking(id);
      fetchBookings(); // Nach dem Löschen aktualisieren
    }
  };

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">Buchungen</h1>

      {/* Kalender-Komponente */}
      <div className="mb-6">
        <CalendarView bookings={bookings} fetchBookings={fetchBookings} instructors={instructors} students={students} />
      </div>

      {/* Button zum Hinzufügen einer neuen Buchung */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 fixed bottom-4 right-4 shadow-lg"
        onClick={() => {
          setIsEditing(false);
          setIsModalOpen(true);
          setSelectedBooking(null);
        }}
      >
        Buchung hinzufügen
      </button>

      {/* Modal für das Formular */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <BookingForm
            booking={selectedBooking || ({} as Booking)}
            onSave={handleSaveBooking}
            onDelete={selectedBooking?.id ? handleDeleteBooking : undefined}
          />
        </Modal>
      )}
    </div>
  );
}
