'use client';

import { useState, useEffect } from 'react';
import { Car } from '@/types/Car';

interface CarFormProps {
  car?: Car | null;
  onSave: (car: Car) => void;
}

const CarForm: React.FC<CarFormProps> = ({ car, onSave }) => {
  const [brand, setBrand] = useState(car?.brand || '');
  const [model, setModel] = useState(car?.model || '');
  const [licensePlate, setLicensePlate] = useState(car?.licensePlate || '');
  const [gearType, setGearType] = useState(car?.gearType || 'Schaltgetriebe');

  useEffect(() => {
    setBrand(car?.brand || '');
    setModel(car?.model || '');
    setLicensePlate(car?.licensePlate || '');
    setGearType(car?.gearType || 'Schaltgetriebe');
  }, [car]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: car?.id,
      brand,
      model,
      licensePlate,
      gearType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6">
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Marke</label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Modell</label>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Kennzeichen</label>
        <input
          type="text"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
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
      <button
        type="submit"
        className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
      >
        Speichern
      </button>
    </form>
  );
};

export default CarForm;
