'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const StudentList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // API-Aufruf, um die Liste der Fahrschüler zu laden (dummy-data)
        const fetchStudents = async () => {
            try {
                const response = await axios.get('/api/students'); // Füge hier die richtige API hinzu
                setStudents(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Schüler:', error);
            }
        };

        fetchStudents();
    }, []);

    return (
        <div>
            <h2>Fahrschüler Liste</h2>
            <ul>
                {students.length > 0 ? (
                    students.map((student: any) => (
                        <li key={student.id}>{student.name} - {student.email}</li>
                    ))
                ) : (
                    <li>Keine Schüler gefunden.</li>
                )}
            </ul>
        </div>
    );
};

export default StudentList;
