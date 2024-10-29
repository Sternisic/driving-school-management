import axios from 'axios';
import { Booking } from '@/types/Booking';

// Hinzufügen einer neuen Buchung
export const addBooking = async (booking: Booking): Promise<Booking> => {
  const response = await axios.post('/api/bookings', booking);
  return response.data;
};


// Alle Buchungen abrufen
export const getBookings = async (): Promise<Booking[]> => {
  const response = await axios.get('/api/bookings');
  return response.data;
};

// Eine Buchung aktualisieren
export const updateBooking = async (id: number, booking: Booking): Promise<Booking> => {
  const response = await axios.put(`/api/bookings/${id}`, booking); // Stelle sicher, dass die Route korrekt ist
  return response.data;
};

// Eine Buchung löschen
export const deleteBooking = async (id: number): Promise<void> => {
  await axios.delete(`/api/bookings/${id}`); // ID als Pfadparameter senden
};
