// pages/BookingForm.tsx
'use client';

import { useState, useEffect } from "react";
import { Student, Instructor, Car, Booking } from "@/types";
import { getStudents } from "@/services/studentService";
import { getInstructors } from "@/services/instructorService";
import { getCars } from "@/services/carService";
import { getBookings } from "@/services/bookingService";
import BookingCarSelector from "@/components/BookingCarSelector";
import BookingInstructorSelector from "@/components/BookingInstructorSelector";
import BookingLessonTypeSelector from "@/components/BookingLessonTypeSelector";
import BookingStudentSelector from "@/components/BookingStudentSelector";
import BookingTimeSelector from "@/components/BookingTimeSelector";

import moment from "moment-timezone";


interface BookingFormProps {
  booking: Partial<Booking>;
  onSave: (booking: Booking) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onBookingSaved?: () => void;
}

export default function BookingForm({
  booking = {},
  onSave,
  onDelete,
  onBookingSaved,
}: BookingFormProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<number | string>(
    booking?.studentId || ""
  );
  const [selectedInstructor, setSelectedInstructor] = useState<number | string>(
    booking?.instructorId || ""
  );
  const [selectedCar, setSelectedCar] = useState<number | string>(
    booking?.carId || ""
  );
  const [description, setDescription] = useState<string>(
    booking?.description || ""
  );
  const [lessonType, setLessonType] = useState<"NORMAL" | "LANDSTRASSE" | "AUTOBAHN" | "DAEMMERUNG">(
    booking?.lessonType || "NORMAL"
  );
  const [paid, setPaid] = useState<boolean>(booking?.paid || false);
  const [date, setDate] = useState<string>(
    booking?.start ? moment(booking.start).tz("Europe/Berlin").format("YYYY-MM-DD") : ""
  );
  const [startTime, setStartTime] = useState<string>(
    booking?.start ? moment(booking.start).tz("Europe/Berlin").format("HH:mm") : ""
  );
  const [endTime, setEndTime] = useState<string>(
    booking?.end ? moment(booking.end).tz("Europe/Berlin").format("HH:mm") : ""
  );

  const availableLessonTypes = [
    { value: "NORMAL", label: "Normale Fahrstunde" },
    { value: "LANDSTRASSE", label: "Landstraße" },
    { value: "AUTOBAHN", label: "Autobahn" },
    { value: "DAEMMERUNG", label: "Dämmerung" },
  ].filter((type) => {
    const student = students.find((s) => s.id === Number(selectedStudent));
    if (student) {
      if (type.value === "LANDSTRASSE" && student.specialTrips.landstrasse) return false;
      if (type.value === "AUTOBAHN" && student.specialTrips.autobahn) return false;
      if (type.value === "DAEMMERUNG" && student.specialTrips.daemmerung) return false;
    }
    return true;
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchedStudents = await getStudents();
      const fetchedInstructors = await getInstructors();
      const fetchedCars = await getCars();
      const fetchedBookings = await getBookings();
      setStudents(fetchedStudents);
      setInstructors(fetchedInstructors);
      setCars(fetchedCars);
      setBookings(fetchedBookings);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = moment.tz(`${date} ${startTime}`, "Europe/Berlin").toDate();
    const end = moment.tz(`${date} ${endTime}`, "Europe/Berlin").toDate();

    // Check for overlapping bookings
    const hasOverlap = bookings.some((b) => {
      if (b.id === booking.id) return false;
      const isInstructorConflict = b.instructorId === Number(selectedInstructor);
      const isCarConflict = b.carId === Number(selectedCar);
      const timeConflict = new Date(b.start) < end && new Date(b.end) > start;
      return (isInstructorConflict || isCarConflict) && timeConflict;
    });

    if (hasOverlap) {
      alert("Zeitüberschneidung: Der Fahrlehrer oder das Auto ist bereits gebucht.");
      return;
    }

    const newBooking: Booking = {
      ...(booking?.id ? { id: booking.id } : {}),
      studentId: Number(selectedStudent),
      instructorId: Number(selectedInstructor),
      carId: Number(selectedCar),
      start,
      end,
      description,
      lessonType,
      paid,
    };

    await onSave(newBooking);
    if (onBookingSaved) onBookingSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 w-full">
      <BookingStudentSelector
        students={students}
        selectedStudent={selectedStudent}
        onSelect={setSelectedStudent}
      />
      <BookingInstructorSelector
        instructors={instructors}
        selectedInstructor={selectedInstructor}
        onSelect={setSelectedInstructor}
      />
      <BookingCarSelector cars={cars} selectedCar={selectedCar} onSelect={setSelectedCar} />
      <BookingTimeSelector
        date={date}
        startTime={startTime}
        endTime={endTime}
        onDateChange={setDate}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
      />
      <BookingLessonTypeSelector
        lessonType={lessonType}
        onLessonTypeChange={setLessonType}
        availableLessonTypes={availableLessonTypes}
      />
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Bezahlt</label>
        <input
          type="checkbox"
          checked={paid}
          onChange={(e) => setPaid(e.target.checked)}
          className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Beschreibung</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
        />
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
        >
          {booking?.id ? "Überschreiben" : "Buchen"}
        </button>
        {onDelete && booking?.id && (
          <button
            type="button"
            onClick={() => onDelete(booking.id)}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
          >
            Löschen
          </button>
        )}
      </div>
    </form>
  );
}
