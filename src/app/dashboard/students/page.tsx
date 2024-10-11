'use client'; // Markiert diese Datei als Client-Komponente

import { useState } from 'react';
import { FaInfoCircle, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import AddLessonModal from '@/components/AddLessonModal'; // Modal importieren

const studentsData = [
    { id: 1, firstName: 'Max', lastName: 'Mustermann', phone: '1234567890', email: 'max@example.com', gearType: 'Schaltgetriebe', address: 'Musterstraße 1, 12345 Musterstadt' },
    { id: 2, firstName: 'Erika', lastName: 'Mustermann', phone: '0987654321', email: 'erika@example.com', gearType: 'Automatik', address: 'Beispielweg 2, 54321 Beispielstadt' },
];

export default function StudentsPage() {
    const [students, setStudents] = useState(studentsData);
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null); // Typ angepasst
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddLesson = (id: number) => {
        setSelectedStudent(id);
        setIsModalOpen(true); // Modal öffnen
    };

    const handleSaveLesson = (lesson: any) => {
        console.log(`Fahrstunde gespeichert:`, lesson);
        // Hier kannst du die Daten speichern oder an eine API senden
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-black">Fahrschülerverwaltung</h1>
                <button className="bg-primary text-white px-4 py-2 rounded hover:bg-red-800">
                    Fahrschüler hinzufügen
                </button>
            </div>
            
            <table className="min-w-full bg-white shadow-md rounded">
                <thead>
                    <tr>
                        <th className="p-4 bg-primary text-white">Info</th>
                        <th className="p-4 bg-primary text-white">Vorname</th>
                        <th className="p-4 bg-primary text-white">Nachname</th>
                        <th className="p-4 bg-primary text-white">Adresse</th>
                        <th className="p-4 bg-primary text-white">Telefonnummer</th>
                        <th className="p-4 bg-primary text-white">E-Mail</th>
                        <th className="p-4 bg-primary text-white">Schalt/Automatik</th>
                        <th className="p-4 bg-primary text-white">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td className="p-4 border-t text-black">
                                <button
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => console.log('Mehr Informationen')}
                                >
                                    <FaInfoCircle />
                                </button>
                            </td>
                            <td className="p-4 border-t text-black">{student.firstName}</td>
                            <td className="p-4 border-t text-black">{student.lastName}</td>
                            <td className="p-4 border-t text-black">{student.address}</td>
                            <td className="p-4 border-t text-black">{student.phone}</td>
                            <td className="p-4 border-t text-black">{student.email}</td>
                            <td className="p-4 border-t text-black">{student.gearType}</td>
                            <td className="p-4 border-t flex justify-end space-x-4">
                                <button
                                    className="text-green-600 hover:text-green-800"
                                    onClick={() => handleAddLesson(student.id)}
                                >
                                    <FaPlus />
                                </button>
                                <button
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => console.log('Bearbeiten')}
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => console.log('Löschen')}
                                >
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal für Fahrstunde hinzufügen */}
            <AddLessonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLesson}
            />
        </div>
    );
}
