"use client";

import { useState, useEffect } from "react";
import { Student } from "@/types/Student";
import Select from "react-select";
import parsePhoneNumber, {
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import CountryFlag from "react-country-flag";
import countries from "i18n-iso-countries";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

interface StudentFormProps {
  student?: Student | null;
  onSave: (student: Student) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSave }) => {

  // Formatierung: yyyy-mm-dd -> tt.mm.jjjj
  const formatDateToDisplay = (date: string) => {
    if (!date) return "";
    const d = new Date(date); // Erstelle ein Date-Objekt
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Formatierung: tt.mm.jjjj -> yyyy-mm-dd
  const formatDateToDatabase = (date: string) => {
    if (!date) return "";
    const [day, month, year] = date.split(".");
    return `${year}-${month}-${day}`;
  };

  const [firstName, setFirstName] = useState(student?.firstName || "");
  const [lastName, setLastName] = useState(student?.lastName || "");
  const [phone, setPhone] = useState(student?.phone || "");
  const [email, setEmail] = useState(student?.email || "");
  const [gearType, setGearType] = useState(
    student?.gearType || "Schaltgetriebe"
  );
  const [address, setAddress] = useState(student?.address || "");
  const [postalCode, setPostalCode] = useState(student?.postalCode || "");
  const [birthDate, setBirthDate] = useState(
    student?.birthDate ? formatDateToDisplay(student.birthDate) : ""
  );
  const [birthPlace, setBirthPlace] = useState(student?.birthPlace || "");
  const [nationality, setNationality] = useState(student?.nationality || "");
  const [occupation, setOccupation] = useState(student?.occupation || "");
  const [lessons, setLessons] = useState(student?.lessons || 0);
  const [specialTrips, setSpecialTrips] = useState({
    landstrasse: student?.specialTrips?.landstrasse || false,
    autobahn: student?.specialTrips?.autobahn || false,
    daemmerung: student?.specialTrips?.daemmerung || false,
  });

  useEffect(() => {
    setFirstName(student?.firstName || "");
    setLastName(student?.lastName || "");
    setPhone(student?.phone || "");
    setEmail(student?.email || "");
    setGearType(student?.gearType || "Schaltgetriebe");
    setAddress(student?.address || "");
    setPostalCode(student?.postalCode || "");
    setBirthDate(student?.birthDate ? formatDateToDisplay(student.birthDate) : "");
    setBirthPlace(student?.birthPlace || "");
    setNationality(student?.nationality || "");
    setOccupation(student?.occupation || "");
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
      postalCode,
      birthDate: formatDateToDatabase(birthDate), // Umwandlung ins Datenbankformat
      birthPlace,
      nationality,
      occupation,
      lessons,
      specialTrips,
    });
  };

  // Funktion zum Formatieren der Telefonnummer
  const formatPhoneNumber = (input: string) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(input, "DE"); // Standard: Deutschland
      return phoneNumber ? phoneNumber.formatInternational() : input;
    } catch {
      return input; // Ungültige Nummer, Eingabe nicht ändern
    }
  };

  // Funktion zum Verarbeiten der Eingabe
  const handlePhoneChange = (input: string) => {
    const formattedPhone = formatPhoneNumber(input);
    setPhone(formattedPhone);
  };

  // Erstelle eine Liste von Ländern für das Dropdown und sortiere Deutschland und Türkei zuerst
  const countryOptions = [
    {
      value: "DE",
      label: (
        <div className="flex items-center">
          <CountryFlag countryCode="DE" svg style={{ marginRight: "8px" }} />{" "}
          Deutschland
        </div>
      ),
    },
    {
      value: "TR",
      label: (
        <div className="flex items-center">
          <CountryFlag countryCode="TR" svg style={{ marginRight: "8px" }} />{" "}
          Türkei
        </div>
      ),
    },
    ...Object.entries(countries.getAlpha2Codes())
      .filter(([countryCode]) => countryCode !== "DE" && countryCode !== "TR")
      .map(([countryCode]) => ({
        value: countryCode,
        label: (
          <div className="flex items-center">
            <CountryFlag
              countryCode={countryCode}
              svg
              style={{ marginRight: "8px" }}
            />
            {countries.getName(countryCode, "de")}
          </div>
        ),
      }))
      .sort((a, b) =>
        a.label.props.children[1].localeCompare(b.label.props.children[1])
      ),
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6">
      {/* Vorname und Nachname nebeneinander */}
      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <label className="block text-black text-sm font-bold mb-2">
            Vorname
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-black text-sm font-bold mb-2">
            Nachname
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      </div>

      {/* Telefonnummer und E-Mail nebeneinander */}
      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <label className="block text-black text-sm font-bold mb-2">
            Telefonnummer
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="+49 123 4567890"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-black text-sm font-bold mb-2">
            E-Mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      </div>

      {/* Adresse und Postleitzahl nebeneinander */}
      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <label className="block text-black text-sm font-bold mb-2">
            Adresse
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-black text-sm font-bold mb-2">
            Postleitzahl
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      </div>

      {/* Geburtsdatum und Geburtsort nebeneinander */}
      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <label className="block text-black text-sm font-bold mb-2">
            Geburtsdatum (tt.mm.jjjj)
          </label>
          <input
            type="text"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="tt.mm.jjjj"
            pattern="\d{2}\.\d{2}\.\d{4}" // Validierung für tt.mm.jjjj
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-black text-sm font-bold mb-2">
            Geburtsort
          </label>
          <input
            type="text"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      </div>

      {/* Nationalität mit Country Picker */}
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">
          Nationalität
        </label>
        <Select
          options={countryOptions}
          value={countryOptions.find((option) => option.value === nationality)}
          onChange={(selectedOption) =>
            setNationality(selectedOption?.value || "")
          }
          className="shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Wähle eine Nationalität"
        />
      </div>

      {/* Beruf */}
      <div className="mb-4">
        <label className="block text-black text-sm font-bold mb-2">Beruf</label>
        <input
          type="text"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      {/* Button */}
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
