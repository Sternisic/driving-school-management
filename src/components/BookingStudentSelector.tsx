// components/BookingStudentSelector.tsx
import { Student } from "@/types/Student";

interface BookingStudentSelectorProps {
  students: Student[];
  selectedStudent: string | number;
  onSelect: (value: string | number) => void;
}

export default function BookingStudentSelector({
  students,
  selectedStudent,
  onSelect,
}: BookingStudentSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-black text-sm font-bold mb-2">Fahrschüler</label>
      <select
        value={selectedStudent}
        onChange={(e) => onSelect(e.target.value)}
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
  );
}
