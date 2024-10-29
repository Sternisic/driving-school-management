export interface Student {
    id?: number; // id ist optional, da es beim Erstellen eines neuen Schülers noch nicht existiert
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    gearType: string;
    address: string;
    postalCode: string; // Postleitzahl
    birthDate: string; // Geburtsdatum (ISO-Format: YYYY-MM-DD)
    birthPlace: string; // Geburtsort
    nationality: string; // Staatsangehörigkeit
    occupation: string; // Beruf
    lessons: number;
    specialTrips: {
        landstrasse: boolean;
        autobahn: boolean;
        daemmerung: boolean;
    };
}
