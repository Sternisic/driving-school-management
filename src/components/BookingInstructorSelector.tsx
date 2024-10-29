// components/BookingInstructorSelector.tsx
import { Instructor } from "@/types/Instructor";

interface BookingInstructorSelectorProps {
  instructors: Instructor[];
  selectedInstructor: string | number;
  onSelect: (value: string | number) => void;
}

export default function BookingInstructorSelector({
  instructors,
  selectedInstructor,
  onSelect,
}: BookingInstructorSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-black text-sm font-bold mb-2">Fahrlehrer</label>
      <select
        value={selectedInstructor}
        onChange={(e) => onSelect(e.target.value)}
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
  );
}
