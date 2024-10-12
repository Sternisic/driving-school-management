'use client';

import { useEffect, useState } from 'react';
import CarList from '@/components/CarList';
import { getCars, addCar, updateCar, deleteCar } from '@/services/carService';
import CarForm from '@/components/CarForm';
import Modal from '@/components/Modal';
import { Car } from '@/types/Car';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCars = async () => {
    const carsData = await getCars();
    setCars(carsData);
  };

  // Autos beim ersten Laden der Seite abrufen
  useEffect(() => {
    fetchCars();
  }, []);

  const handleSaveCar = async (car: Car) => {
    if (isEditing && car.id) {
      // Bearbeiten
      await updateCar(car);
    } else {
      // Hinzufügen
      await addCar(car);
    }
    fetchCars(); // Tabelle nach dem Speichern aktualisieren
    setIsModalOpen(false); // Modal schließen
  };

  // Auto bearbeiten (ausgewähltes Auto ins Formular laden)
  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setIsEditing(true); // Bearbeitungsmodus aktivieren
    setIsModalOpen(true); // Modal öffnen
  };

  // Auto löschen
  const handleDeleteCar = async (id: number) => {
    if (window.confirm('Möchtest du dieses Auto wirklich löschen?')) {
      try {
        await deleteCar(id);
        fetchCars(); // Aktualisiere die Liste der Autos nach dem Löschen
      } catch (error) {
        console.error('Fehler beim Löschen des Autos:', error);
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6">Auto-Verwaltung</h1>

      <CarList cars={cars} onEdit={handleEditCar} onDelete={handleDeleteCar} />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 fixed bottom-4 right-4 shadow-lg"
        onClick={() => {
          setIsEditing(false);
          setIsModalOpen(true);
          setSelectedCar(null);
        }}
      >
        Auto hinzufügen
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CarForm car={selectedCar} onSave={handleSaveCar} />
      </Modal>
    </div>
  );
}
