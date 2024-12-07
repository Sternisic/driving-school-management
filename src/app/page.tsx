"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Benutzername und Passwort erforderlich");
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false, // Verhindert automatische Umleitung
        username,
        password,
      });

      if (res?.error) {
        setError(res.error); // Zeigt die Fehlermeldung von `next-auth` an
      } else {
        setError(null);
        window.location.href = "/dashboard"; // Manuelle Umleitung zur Dashboard-Startseite
      }
    } catch (err) {
      console.error("Login fehlgeschlagen:", err);
      setError("Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="p-8 bg-white shadow-2xl rounded-xl w-full max-w-md md:max-w-lg lg:max-w-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Willkommen!
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-6">
          <input
            id="username"
            type="text"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Benutzername eingeben"
          />
        </div>
        <div className="mb-6">
          <input
            id="password"
            type="password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort eingeben"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
