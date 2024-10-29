import { Instructor } from "@/types/Instructor";
import { Student } from "@/types/Student";

interface CalendarFiltersProps {
  selectedInstructor: string | null;
  setSelectedInstructor: (value: string | null) => void;
  selectedStudent: string | null;
  setSelectedStudent: (value: string | null) => void;
  selectedPaid: string | null; // Jetzt ein String für den Dropdown-Status (alle, bezahlt, nicht bezahlt)
  setSelectedPaid: (value: string | null) => void;
  instructors: Instructor[];
  students: Student[];
}

const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  selectedInstructor,
  setSelectedInstructor,
  selectedStudent,
  setSelectedStudent,
  selectedPaid, // Hinzugefügt
  setSelectedPaid, // Hinzugefügt
  instructors,
  students,
}) => {
  return (
    <div className="flex space-x-4"> {/* Flexbox für nebeneinander angeordnete Filter */}
      {/* Filter für Fahrlehrer */}
      <div className="flex-1">
        <select
          value={selectedInstructor || ""}
          onChange={(e) => setSelectedInstructor(e.target.value || null)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Alle Fahrlehrer</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.firstName} {instructor.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Filter für Fahrschüler */}
      <div className="flex-1">
        <select
          value={selectedStudent || ""}
          onChange={(e) => setSelectedStudent(e.target.value || null)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Alle Fahrschüler</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown für Bezahlstatus */}
      <div className="flex-1">
        <select
          value={selectedPaid || ""}
          onChange={(e) => setSelectedPaid(e.target.value || null)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Alle Buchungen</option>
          <option value="paid">Nur bezahlte</option>
          <option value="unpaid">Nur unbezahlte</option>
        </select>
      </div>
    </div>
  );
};

export default CalendarFilters;
