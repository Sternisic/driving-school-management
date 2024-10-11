'use client'; // Client-Komponente

import { useState } from 'react';
import axios from 'axios';

const StudentForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/students', { name, email });
            console.log(response.data);
            setName(''); // Formular zurücksetzen
            setEmail(''); // Formular zurücksetzen
        } catch (error) {
            console.error('Error adding student', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Fahrschüler hinzufügen</button>
        </form>
    );
};

export default StudentForm; // Sicherstellen, dass dies als default exportiert wird
