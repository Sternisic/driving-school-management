// BookingList.tsx
import { Booking } from '@/types/Booking'; // Importiere den Booking-Typ
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

// Definiere die Props für die BookingList-Komponente
interface BookingListProps {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onDelete: (id: number) => Promise<void>;
}

// Definiere die BookingList-Komponente
const BookingList: React.FC<BookingListProps> = ({ bookings, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded">
      <thead>
        <tr>
          <th className="p-4 bg-primary text-white">Fahrschüler</th>
          <th className="p-4 bg-primary text-white">Fahrlehrer</th>
          <th className="p-4 bg-primary text-white">Auto</th>
          <th className="p-4 bg-primary text-white">Startzeit</th>
          <th className="p-4 bg-primary text-white">Endzeit</th>
          <th className="p-4 bg-primary text-white">Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <tr key={booking.id}>
            <td className="p-4 border-t text-black">{booking.student?.firstName} {booking.student?.lastName}</td>
            <td className="p-4 border-t text-black">{booking.instructor?.firstName} {booking.instructor?.lastName}</td>
            <td className="p-4 border-t text-black">{booking.car?.brand} {booking.car?.model}</td>
            <td className="p-4 border-t text-black">{new Date(booking.start).toLocaleString()}</td>
            <td className="p-4 border-t text-black">{new Date(booking.end).toLocaleString()}</td>
            <td className="p-4 border-t flex justify-end space-x-4">
              <button className="text-blue-600 hover:text-blue-800" onClick={() => onEdit(booking)}>
                <FaEdit />
              </button>
              <button className="text-red-600 hover:text-red-800" onClick={() => onDelete(booking.id!)}>
                <FaTrashAlt />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookingList;
