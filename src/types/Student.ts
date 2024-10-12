export interface Student {
    id?: number; // id ist optional, da es beim Erstellen eines neuen Schülers noch nicht existiert
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    gearType: string;
    address: string;
    lessons: number;
    specialTrips: {
        landstrasse: boolean;
        autobahn: boolean;
        daemmerung: boolean;
    };
}
