'use client';

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const SessionsPage = () => {
  const sessions = [
    { id: 1, name: "Theorie 1" },
    { id: 2, name: "Theorie 2" },
    { id: 3, name: "Theorie 3" },
    { id: 4, name: "Theorie 4" },
    { id: 5, name: "Theorie 5" },
    { id: 6, name: "Theorie 6" },
    { id: 7, name: "Theorie 7" },
    { id: 8, name: "Theorie 8" },
    { id: 9, name: "Theorie 9" },
    { id: 10, name: "Theorie 10" },
    { id: 11, name: "Theorie 11" },
    { id: 12, name: "Theorie 12" },
  ];

  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  const handleStartSession = (sessionId: number) => {
    setSelectedSession(sessionId);
  };

  const closeModal = () => {
    setSelectedSession(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-black mb-6">Unterrichtseinheiten</h1>
      <div className="grid grid-cols-4 gap-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-white shadow-md rounded p-4 flex flex-col items-center"
          >
            <h2 className="text-xl font-bold mb-4 text-black">{session.name}</h2>
            <button
              onClick={() => handleStartSession(session.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Anmelden
            </button>
          </div>
        ))}
      </div>

      {/* QR-Code als Modal anzeigen */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center shadow-lg relative w-[80%] max-w-3xl flex flex-col items-center justify-center">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-black hover:text-black text-2xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-black">
              QR-Code für Einheit {selectedSession}
            </h2>
            <div className="flex justify-center">
              <QRCodeSVG
                value={`${window.location.origin}/dashboard/sessions/${selectedSession}`}
                size={512} // Größerer QR-Code
              />
            </div>
            <p className="mt-6 text-gray-600 text-lg">
              Scanne diesen QR-Code, um dich einzutragen.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
