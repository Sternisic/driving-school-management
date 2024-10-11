'use client'; // Füge dies ganz oben in der Datei hinzu

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/')
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h1>Driving School Management System</h1>
            <p>{message}</p>
        </div>
    );
}
