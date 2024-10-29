import { Student } from './Student';
import { Instructor } from './Instructor';
import { Car } from './Car';

export interface SpecialTrips {
  autobahn: boolean;
  daemmerung: boolean;
  landstrasse: boolean;
}

export interface Booking {
  id?: number;
  start: Date;
  end: Date;
  studentId: number;
  instructorId: number;
  carId: number;
  description?: string; // Optionales Feld für die Beschreibung
  specialTrips?: SpecialTrips; // Optionales Feld für spezielle Fahrten
  lessonType?: 'NORMAL' | 'LANDSTRASSE' | 'AUTOBAHN' | 'DAEMMERUNG'; // Art der Fahrstunde
  paid?: boolean; // Neues Feld für den Bezahlstatus
  student?: Student;
  instructor?: Instructor;
  car?: Car;
}
