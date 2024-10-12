import axios from 'axios';
import { Car } from '@/types/Car';

// Autos abrufen
export const getCars = async () => {
  const response = await axios.get('/api/cars');
  return response.data;
};

// Auto hinzufügen
export const addCar = async (car: Car) => {
  const response = await axios.post('/api/cars', car);
  return response.data;
};

// Auto bearbeiten
export const updateCar = async (car: Car) => {
  const response = await axios.put(`/api/cars/${car.id}`, car);
  return response.data;
};

// Auto löschen
export const deleteCar = async (id: number) => {
  const response = await axios.delete(`/api/cars/${id}`);
  return response.data;
};
