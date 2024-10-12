'use client';

import { useState, useEffect } from 'react';
import { Student } from '@/types/Student';

interface StudentFormProps {
  student?: Student | null;
  onSave: (student: Student) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSave }) => {
  const [firstName, setFirstName] = useState(student?.firstName || '');
  const [lastName, setLastName] = useState(student?.lastName || '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [email, setEmail] = useState(student?.email || '');
  const [gearType, setGearType] = useState(student?.gearType || 'Schaltgetriebe');
  const [address, setAddress] = useState(student?.address || '');
  const [lessons, setLessons] = useState(student?.lessons || 0);
  const [specialTrips, setSpecialTrips] = useState({
    landstrasse: student?.specialTrips?.landstrasse || false,
    autobahn: student?.specialTrips?.autobahn || false,
    daemmerung: student?.specialTrips?.daemmerung || false,
  });

  // Aktualisiere das Formular, wenn sich der ausgewählte Schüler ändert
  useEffect(() => {
    setFirstName(student?.firstName || '');
    setLastName(student?.lastName || '');
    setPhone(student?.phone || '');
    setEmail(student?.email || '');
    setGearType(student?.gearType || 'Schaltgetriebe');
    setAddress(student?.address || '');
    setLessons(student?.lessons || 0);
    setSpecialTrips({
      landstrasse: student?.specialTrips?.landstrasse || false,
      autobahn: student?.specialTrips?.autobahn || false,
      daemmerung: student?.specialTrips?.daemmerung || false,
    });
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: student?.id, // Nur gesetzt, wenn wir bearbeiten
      firstName,
      lastName,
      phone,
      email,
      gearType,
      address,
      lessons,
      specialTrips,
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
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">E-Mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Adresse</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Schalt/Automatik</label>
        <select
          value={gearType}
          onChange={(e) => setGearType(e.target.value)}
          className="border rounded w-full p-2"
          required
        >
          <option value="Schaltgetriebe">Schaltgetriebe</option>
          <option value="Automatik">Automatik</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Anzahl der Fahrstunden</label>
        <input
          type="number"
          value={lessons}
          onChange={(e) => setLessons(parseInt(e.target.value, 10))}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Sonderfahrten</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={specialTrips.landstrasse}
              onChange={(e) => setSpecialTrips({ ...specialTrips, landstrasse: e.target.checked })}
            />
            <span className="ml-2">Landstraße</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={specialTrips.autobahn}
              onChange={(e) => setSpecialTrips({ ...specialTrips, autobahn: e.target.checked })}
            />
            <span className="ml-2">Autobahn</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={specialTrips.daemmerung}
              onChange={(e) => setSpecialTrips({ ...specialTrips, daemmerung: e.target.checked })}
            />
            <span className="ml-2">Dämmerung</span>
          </label>
        </div>
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

export default StudentForm;
