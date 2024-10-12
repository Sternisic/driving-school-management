'use client';

import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Instructor } from '@/types/Instructor';

interface InstructorListProps {
  instructors: Instructor[];
  onEdit: (instructor: Instructor) => void;
  onDelete: (id: number) => void;
}

const InstructorList: React.FC<InstructorListProps> = ({ instructors, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded">
      <thead>
        <tr>
          <th className="p-4 bg-primary text-white">Vorname</th>
          <th className="p-4 bg-primary text-white">Nachname</th>
          <th className="p-4 bg-primary text-white">Telefonnummer</th>
          <th className="p-4 bg-primary text-white">Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {instructors.map((instructor) => (
          <tr key={instructor.id}>
            <td className="p-4 border-t text-black">{instructor.firstName}</td>
            <td className="p-4 border-t text-black">{instructor.lastName}</td>
            <td className="p-4 border-t text-black">{instructor.phone}</td>
            <td className="p-4 border-t flex justify-end space-x-4">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => onEdit(instructor)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => instructor.id && onDelete(instructor.id)}
              >
                <FaTrashAlt />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InstructorList;
