'use client';

import { useState, useEffect } from 'react';
import { Student } from '@/types/Student';
import { Instructor } from '@/types/Instructor';
import { Car } from '@/types/Car';
import { getStudents } from '@/services/studentService';
import { getInstructors } from '@/services/instructorService';
import { getCars } from '@/services/carService';
import { Booking } from '@/types/Booking'; // Importiere das angepasste Booking Interface

interface BookingFormProps {
  booking: Partial<Booking>; // Das `booking`-Objekt kann unvollständig sein
  onSave: (booking: Booking) => Promise<void>;
  onDelete?: (id: number) => Promise<void>; // Optional, falls das Löschen gewünscht ist
}

export default function BookingForm({ booking = {}, onSave, onDelete }: BookingFormProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [cars, setCars] = useState<Car[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<number | string>(booking?.studentId || '');
  const [selectedInstructor, setSelectedInstructor] = useState<number | string>(booking?.instructorId || '');
  const [selectedCar, setSelectedCar] = useState<number | string>(booking?.carId || '');
  const [startTime, setStartTime] = useState<string>(booking?.start ? booking.start.toISOString().slice(0, 16) : '');
  const [endTime, setEndTime] = useState<string>(booking?.end ? booking.end.toISOString().slice(0, 16) : '');
  

  // Daten vom Backend laden
  useEffect(() => {
    const fetchData = async () => {
      const fetchedStudents = await getStudents();
      const fetchedInstructors = await getInstructors();
      const fetchedCars = await getCars();
      setStudents(fetchedStudents);
      setInstructors(fetchedInstructors);
      setCars(fetchedCars);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking: Omit<Booking, 'id'> = {
      studentId: Number(selectedStudent),
      instructorId: Number(selectedInstructor),
      carId: Number(selectedCar),
      start: new Date(startTime), // Umwandlung in ein Date-Objekt
      end: new Date(endTime),
    };

    await onSave(newBooking as Booking); // Sende die neue Buchung an den Service
  };

  const handleDelete = async () => {
    if (onDelete && booking?.id) {
      await onDelete(booking?.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Buchung erstellen</h2>

      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Fahrschüler</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Wähle einen Fahrschüler</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Fahrlehrer</label>
        <select
          value={selectedInstructor}
          onChange={(e) => setSelectedInstructor(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Wähle einen Fahrlehrer</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.firstName} {instructor.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Auto</label>
        <select
          value={selectedCar}
          onChange={(e) => setSelectedCar(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Wähle ein Auto</option>
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.brand} {car.model} ({car.licensePlate})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Startzeit</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Endzeit</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
        >
          Buchen
        </button>

        {onDelete && booking?.id && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
          >
            Löschen
          </button>
        )}
      </div>
    </form>
  );
}
