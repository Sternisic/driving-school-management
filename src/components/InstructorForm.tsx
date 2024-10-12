'use client';

import { useState, useEffect } from 'react';
import { Instructor } from '@/types/Instructor';

interface InstructorFormProps {
  instructor?: Instructor | null;
  onSave: (instructor: Instructor) => void;
}

const InstructorForm: React.FC<InstructorFormProps> = ({ instructor, onSave }) => {
  const [firstName, setFirstName] = useState(instructor?.firstName || '');
  const [lastName, setLastName] = useState(instructor?.lastName || '');
  const [phone, setPhone] = useState(instructor?.phone || '');

  useEffect(() => {
    setFirstName(instructor?.firstName || '');
    setLastName(instructor?.lastName || '');
    setPhone(instructor?.phone || '');
  }, [instructor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: instructor?.id || undefined,  // Falls id undefined ist, wird ein neuer Instructor erstellt
      firstName,
      lastName,
      phone,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6">
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Vorname</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Nachname</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Telefonnummer</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
      >
        Speichern
      </button>
    </form>
  );
};

export default InstructorForm;
