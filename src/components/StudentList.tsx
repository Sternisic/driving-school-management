import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { Student } from "@/types/Student";
import CountryFlag from "react-country-flag";
import countries from "i18n-iso-countries";
import Link from "next/link";

// Länder auf Deutsch registrieren
countries.registerLocale(require("i18n-iso-countries/langs/de.json")); // Deutsch verwenden

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

const StudentList: React.FC<StudentListProps> = ({
  students,
  onEdit,
  onDelete,
}) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded table-fixed">
      <thead>
        <tr>
          <th className="p-2 bg-primary text-white text-sm">Vorname</th>
          <th className="p-2 bg-primary text-white text-sm">Nachname</th>
          <th className="p-2 bg-primary text-white text-sm">Adresse</th>
          <th className="p-2 bg-primary text-white text-sm">Postleitzahl</th>
          <th className="p-2 bg-primary text-white text-sm">Telefonnummer</th>
          <th className="p-2 bg-primary text-white text-sm">E-Mail</th>
          <th className="p-2 bg-primary text-white text-sm">Schalt/Automatik</th>
          <th className="p-2 bg-primary text-white text-sm">Nationalität</th>
          <th className="p-2 bg-primary text-white text-sm">Fahrstunden</th>
          <th className="p-2 bg-primary text-white text-sm">Sonderfahrten</th>
          <th className="p-2 bg-primary text-white text-sm">Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td className="p-2 border-t text-black text-sm">
              <Link
                href={`/dashboard/students/${student.id}`}
                className="cursor-pointer hover:underline"
              >
                {student.firstName}
              </Link>
            </td>
            <td className="p-2 border-t text-black text-sm">
              <Link
                href={`/dashboard/students/${student.id}`}
                className="cursor-pointer hover:underline"
              >
                {student.lastName}
              </Link>
            </td>
            <td className="p-2 border-t text-black text-sm">{student.address}</td>
            <td className="p-2 border-t text-black text-sm">{student.postalCode}</td>
            <td className="p-2 border-t text-black text-sm">
              <span className="cursor-pointer hover:underline">{student.phone}</span>
            </td>
            <td className="p-2 border-t text-black text-sm">
              <span className="cursor-pointer hover:underline">{student.email}</span>
            </td>
            <td className="p-2 border-t text-black text-sm">{student.gearType}</td>
            <td className="p-2 border-t text-black text-sm">
              <div className="flex items-center">
                {student.nationality && (
                  <CountryFlag
                    countryCode={student.nationality}
                    svg
                    style={{
                      width: "1.5em",
                      height: "1.5em",
                      marginRight: "8px",
                    }}
                  />
                )}
                <span>
                  {countries.getName(student.nationality, "de")}
                </span>
              </div>
            </td>
            <td className="p-2 border-t text-black text-sm">{student.lessons}</td>
            <td className="p-2 border-t text-black text-sm">
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
