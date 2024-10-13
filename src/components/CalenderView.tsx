'use client';

import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import BookingForm from './BookingForm';
import { Booking } from '@/types/Booking'; // Importiere das Booking Interface
import { getBookings, addBooking, deleteBooking } from '@/services/bookingService'; // Verwende den Booking-Service

const localizer = momentLocalizer(moment);

export default function CalendarView() {
  const [bookings, setBookings] = useState<Booking[]>([]); // Buchungen aus der API
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Partial<Booking> | null>(null);

  // Buchungen abrufen
  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getBookings(); // Verwende den Service, um Buchungen abzurufen
      setBookings(data);
    };
    fetchBookings();
  }, []);

  // Behandle die Auswahl eines Slots im Kalender
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedBooking({
      start: slotInfo.start || new Date(), // Fallback auf aktuelles Datum
      end: slotInfo.end || new Date(),
    });
    setIsModalOpen(true); // Öffne das Modal zur Buchung
  };

  // Buchung speichern
  const handleSaveBooking = async (booking: Booking) => {
    await addBooking(booking); // Speichere die neue Buchung
    const data = await getBookings(); // Aktualisiere die Buchungen
    setBookings(data);
    setIsModalOpen(false); // Schließe das Modal nach dem Speichern
  };

  // Buchung löschen
  const handleDeleteBooking = async (id: number) => {
    if (window.confirm('Möchtest du diese Buchung wirklich löschen?')) {
      await deleteBooking(id); // Lösche die Buchung über den Service
      const data = await getBookings(); // Aktualisiere die Buchungen
      setBookings(data);
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={bookings} // Buchungen in den Kalender laden
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        selectable
        onSelectSlot={handleSelectSlot} // Bei Slot-Auswahl öffnet sich das Modal
        onSelectEvent={(event) => {
          const booking = bookings.find(b => b.id === event.id);
          if (booking) setSelectedBooking(booking); // Setze die ausgewählte Buchung für die Bearbeitung
          setIsModalOpen(true);
        }}
      />
      {isModalOpen && selectedBooking && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <BookingForm booking={selectedBooking} onSave={handleSaveBooking} onDelete={handleDeleteBooking} />
</Modal>
      )}
    </div>
  );
}
