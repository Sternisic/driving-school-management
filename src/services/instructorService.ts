// src/services/instructorService.ts
import axios from 'axios';
import { Instructor } from '@/types/Instructor';

// Fahrlehrer abrufen
export const getInstructors = async (): Promise<Instructor[]> => {
  const response = await axios.get('/api/instructors');
  return response.data;
};

// Fahrlehrer hinzufügen
export const addInstructor = async (instructor: Instructor): Promise<Instructor> => {
  const response = await axios.post('/api/instructors', instructor);
  return response.data;
};

// Fahrlehrer aktualisieren
export const updateInstructor = async (instructor: Instructor): Promise<Instructor> => {
  const response = await axios.put(`/api/instructors/${instructor.id}`, instructor);
  return response.data;
};

// Fahrlehrer löschen
export const deleteInstructor = async (id: number): Promise<void> => {
  await axios.delete(`/api/instructors/${id}`);
};
