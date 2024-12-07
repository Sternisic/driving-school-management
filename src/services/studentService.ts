import axios from 'axios';

// Alle Schüler abrufen (GET)
export const getStudents = async () => {
  const response = await axios.get('/api/students');
  return response.data;
};

// Neuen Schüler hinzufügen (POST)
export const addStudent = async (student: any) => {
  const response = await axios.post('/api/students', student);
  return response.data;
};

// Schüler bearbeiten (PUT)
export const updateStudent = async (id: number, student: any) => {
  const response = await axios.put(`/api/students/${id}`, student);
  return response.data;
};

// Schüler löschen (DELETE)
export const deleteStudent = async (id: number) => {
  const response = await axios.delete(`/api/students/${id}`);
  return response.data;
};

// Einzelnen Schüler abrufen (GET)
export const getStudent = async (id: number) => {
  const response = await axios.get(`/api/students/${id}`);
  return response.data;
};
