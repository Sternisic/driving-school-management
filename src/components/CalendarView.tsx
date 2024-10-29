import { Calendar, dateFnsLocalizer, SlotInfo, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { de } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect, useRef } from "react";
import Modal from "@/components/Modal";
import BookingForm from "./BookingForm";
import { Booking } from "@/types/Booking";
import { addBooking, deleteBooking, updateBooking } from "@/services/bookingService";
import { Instructor } from "@/types/Instructor";
import { Student } from "@/types/Student";
import { eventStyleGetter } from "./EventStyleGetter";
import DownloadButton from "./DownloadButton";
import CalendarFilters from "./CalendarFilters";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const locales = { de: de };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const messages = {
  allDay: "Ganztägig",
  previous: "Zurück",
  next: "Weiter",
  today: "Heute",
  month: "Monat",
  week: "Woche",
  day: "Tag",
  agenda: "Agenda",
  date: "Datum",
  time: "Uhrzeit",
  event: "Ereignis",
  noEventsInRange: "Keine Ereignisse in diesem Zeitraum.",
  showMore: (total: any) => `+${total} mehr`,
};

interface CalendarViewProps {
  bookings: Booking[];
  fetchBookings: () => Promise<void>;
  instructors: Instructor[];
  students: Student[];
}

export default function CalendarView({
  bookings,
  fetchBookings,
  instructors = [],
  students = [],
}: CalendarViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Partial<Booking> | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedPaid, setSelectedPaid] = useState<string | null>(null); // Jetzt ein String für den Paid-Filter
  const calendarRef = useRef<HTMLDivElement>(null);

  const processBookings = (bookings: Booking[]) => {
    return bookings.map((booking) => ({
      ...booking,
      start: new Date(booking.start),
      end: new Date(booking.end),
      title: `${booking.student?.firstName || ""} ${booking.student?.lastName || ""} - ${
        booking.description || "Keine Beschreibung"
      }`,
    }));
  };

  const [processedBookings, setProcessedBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setProcessedBookings(processBookings(bookings));
  }, [bookings]);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedBooking({
      start: new Date(slotInfo.start),
      end: new Date(slotInfo.end),
    });
    setIsModalOpen(true);
  };

  const handleSaveBooking = async (booking: Booking) => {
    if (booking.id) {
      await updateBooking(booking.id, {
        ...booking,
        start: new Date(booking.start),
        end: new Date(booking.end),
      });
    } else {
      await addBooking({
        ...booking,
        start: new Date(booking.start),
        end: new Date(booking.end),
      });
    }
    await fetchBookings();
    setIsModalOpen(false);
  };

  const handleDeleteBooking = async (id: number) => {
    if (window.confirm("Möchtest du diese Buchung wirklich löschen?")) {
      await deleteBooking(id);
      await fetchBookings();
    }
    setIsModalOpen(false);
  };

  const handleDownloadPDF = async () => {
    if (calendarRef.current) {
      const canvas = await html2canvas(calendarRef.current, {
        scale: 3,
        useCORS: true,
        height: calendarRef.current.scrollHeight,
        windowHeight: calendarRef.current.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("calendar.pdf");
    }
  };

  // Filtere die Buchungen basierend auf Instructor, Student und Paid Status
  const filteredBookings = processedBookings.filter((booking) => {
    if (selectedInstructor && booking.instructorId !== parseInt(selectedInstructor)) {
      return false;
    }
    if (selectedStudent && booking.studentId !== parseInt(selectedStudent)) {
      return false;
    }
    if (selectedPaid === "paid" && !booking.paid) {
      return false;
    }
    if (selectedPaid === "unpaid" && booking.paid) {
      return false;
    }
    return true;
  });

  return (
    <div className="calendar-container">
      {/* Flexbox für Filter und DownloadButton in einer Reihe */}
      <div className="flex justify-between items-center mb-4">
        {/* Filters in a row */}
        <div className="flex space-x-4">
          <CalendarFilters
            selectedInstructor={selectedInstructor}
            setSelectedInstructor={setSelectedInstructor}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            selectedPaid={selectedPaid} // Hinzugefügt: Filter für Bezahlstatus
            setSelectedPaid={setSelectedPaid} // Hinzugefügt: Setzen des Bezahlstatus
            instructors={instructors}
            students={students}
          />
        </div>

        {/* Button for PDF Export */}
        <DownloadButton handleDownloadPDF={handleDownloadPDF} />
      </div>

      {/* Kalender-Container */}
      <div ref={calendarRef}>
        <Calendar
          culture="de"
          localizer={localizer}
          messages={messages}
          events={filteredBookings}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day", "agenda"]}
          defaultView={Views.WEEK}
          style={{ height: 600 }}
          showMultiDayTimes
          eventPropGetter={(event) => eventStyleGetter(event, instructors)}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => {
            const booking = filteredBookings.find((b) => b.id === event.id);
            if (booking) setSelectedBooking(booking);
            setIsModalOpen(true);
          }}
          min={new Date(1970, 1, 1, 8)}
          max={new Date(1970, 1, 1, 16)}
          step={30}
          timeslots={2}
          defaultDate={new Date()}
          className="text-black"
        />
      </div>

      {isModalOpen && selectedBooking && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <BookingForm
            booking={selectedBooking as Booking}
            onSave={handleSaveBooking}
            onDelete={handleDeleteBooking}
            onBookingSaved={fetchBookings}
          />
        </Modal>
      )}
    </div>
  );
}
