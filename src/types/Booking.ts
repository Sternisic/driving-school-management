import { Student } from './Student';
import { Instructor } from './Instructor';
import { Car } from './Car';

export interface Booking {
  id?: number;
  start: Date; // Verwende Date statt string für Datumsfelder
  end: Date; // Verwende Date statt string
  studentId: number;
  instructorId: number;
  carId: number;
  student?: Student; // Optionale Beziehung zu Student
  instructor?: Instructor; // Optionale Beziehung zu Instructor
  car?: Car; // Optionale Beziehung zu Car
}
