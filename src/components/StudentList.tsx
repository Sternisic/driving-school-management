import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { Student } from '@/types/Student';
import CountryFlag from 'react-country-flag';
import countries from 'i18n-iso-countries';

// Länder auf Deutsch registrieren
countries.registerLocale(require('i18n-iso-countries/langs/de.json')); // Deutsch verwenden

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded">
      <thead>
        <tr>
          <th className="p-4 bg-primary text-white">Vorname</th>
          <th className="p-4 bg-primary text-white">Nachname</th>
          <th className="p-4 bg-primary text-white">Adresse</th>
          <th className="p-4 bg-primary text-white">Postleitzahl</th> {/* Neue Spalte */}
          <th className="p-4 bg-primary text-white">Telefonnummer</th>
          <th className="p-4 bg-primary text-white">E-Mail</th>
          <th className="p-4 bg-primary text-white">Schalt/Automatik</th>
          <th className="p-4 bg-primary text-white">Nationalität</th> {/* Neue Spalte */}
          <th className="p-4 bg-primary text-white">Fahrstunden</th>
          <th className="p-4 bg-primary text-white">Sonderfahrten</th>
          <th className="p-4 bg-primary text-white">Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td className="p-4 border-t text-black">{student.firstName}</td>
            <td className="p-4 border-t text-black">{student.lastName}</td>
            <td className="p-4 border-t text-black">{student.address}</td>
            <td className="p-4 border-t text-black">{student.postalCode}</td> {/* Postleitzahl */}
            <td className="p-4 border-t text-black">{student.phone}</td>
            <td className="p-4 border-t text-black">{student.email}</td>
            <td className="p-4 border-t text-black">{student.gearType}</td>
            <td className="p-4 border-t text-black">
              {/* Nationalität mit Flagge */}
              <div className="flex items-center">
                {student.nationality && (
                  <CountryFlag
                    countryCode={student.nationality}
                    svg
                    style={{
                      width: '2em',
                      height: '2em',
                      marginRight: '10px',
                    }}
                  />
                )}
                <span>{countries.getName(student.nationality, "de")}</span> {/* Deutsch */}
              </div>
            </td>
            <td className="p-4 border-t text-black">{student.lessons}</td>
            <td className="p-4 border-t text-black">
              <div className="flex space-x-2">
                <div className="flex items-center">
                  {student.specialTrips.landstrasse ? (
                    <FaCheck className="text-green-600" />
                  ) : (
                    <FaTimes className="text-red-600" />
                  )}
                  <span className="ml-1">Landstraße</span>
                </div>
                <div className="flex items-center">
                  {student.specialTrips.autobahn ? (
                    <FaCheck className="text-green-600" />
                  ) : (
                    <FaTimes className="text-red-600" />
                  )}
                  <span className="ml-1">Autobahn</span>
                </div>
                <div className="flex items-center">
                  {student.specialTrips.daemmerung ? (
                    <FaCheck className="text-green-600" />
                  ) : (
                    <FaTimes className="text-red-600" />
                  )}
                  <span className="ml-1">Dämmerung</span>
                </div>
              </div>
            </td>
            <td className="p-4 border-t flex justify-end space-x-4">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => onEdit(student)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => onDelete(student.id!)} // "!" da wir sicherstellen, dass id vorhanden ist
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

export default StudentList;
