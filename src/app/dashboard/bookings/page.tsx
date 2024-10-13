'use client';

import { useState, useEffect } from 'react';
import { Booking } from '@/types/Booking';
import { getBookings, addBooking, updateBooking, deleteBooking } from '@/services/bookingService'; // API-Funktionen
import BookingList from '@/components/BookingList'; // Komponente für die Buchungsliste
import BookingForm from '@/components/BookingForm'; // Komponente für das Buchungsformular
import Modal from '@/components/Modal'; // Modal-Komponente für das Formular
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { de } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Lokalisierung für den Kalender mit date-fns
const locales = {
  'de': de,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Woche beginnt am Montag
  getDay,
  locales,
});

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Funktion zum Abrufen der Buchungen
  const fetchBookings = async () => {
    const bookingsData = await getBookings();
    setBookings(bookingsData);
  };

  // Beim ersten Laden der Seite Buchungen abrufen
  useEffect(() => {
    fetchBookings();
  }, []); // Leere Abhängigkeit, damit der Hook nur einmal ausgeführt wird
  

  // Funktion zum Speichern von Buchungen (hinzufügen oder bearbeiten)
  const handleSaveBooking = async (booking: Booking) => {
    if (isEditing && booking.id) {
      await updateBooking(booking.id, booking);
    } else {
      await addBooking(booking); // Achte darauf, dass dieser Aufruf nur einmal ausgeführt wird
    }
    fetchBookings(); // Daten nach dem Speichern aktualisieren
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

  // Buchungen für den Kalender vorbereiten
  const events = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.student?.firstName} ${booking.student?.lastName} - ${booking.instructor?.firstName} ${booking.instructor?.lastName}`,
    start: new Date(booking.start),
    end: new Date(booking.end),
  }));

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">Buchungen</h1>

      {/* Kalender-Komponente */}
      <div className="mb-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={(slotInfo) => {
            setSelectedDate(slotInfo.start);
            setIsEditing(false);
            setIsModalOpen(true); // Modal für neue Buchung öffnen
          }}
          onSelectEvent={(event) => {
            const booking = bookings.find(b => b.id === event.id);
            if (booking) handleEditBooking(booking);
          }}
        />
      </div>

      {/* Buchungsliste */}
      <BookingList
        bookings={bookings}
        onEdit={handleEditBooking}
        onDelete={handleDeleteBooking}
      />

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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <BookingForm booking={selectedBooking as Booking} onSave={handleSaveBooking} onDelete={handleDeleteBooking} />
      </Modal>
    </div>
  );
}
