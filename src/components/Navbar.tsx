"use client";

import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-primary text-white p-4">
      <ul className="flex space-x-4 items-center">
        <li>
          <a href="/dashboard/students" className="hover:bg-red-800 p-2 rounded">
            Fahrschüler
          </a>
        </li>
        <li>
          <a href="/dashboard/instructors" className="hover:bg-red-800 p-2 rounded">
            Fahrlehrer
          </a>
        </li>
        <li>
          <a href="/dashboard/cars" className="hover:bg-red-800 p-2 rounded">
            Autos
          </a>
        </li>
        <li>
          <a href="/dashboard/bookings" className="hover:bg-red-800 p-2 rounded">
            Kalender
          </a>
        </li>
        <li>
          <a href="/dashboard/documents" className="hover:bg-red-800 p-2 rounded">
            Dokumente
          </a>
        </li>
        <li>
          <a href="/dashboard/sessions" className="hover:bg-red-800 p-2 rounded">
            Unterrichtseinheiten
          </a>
        </li>
        {session && (
          <li className="!ml-auto">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hover:bg-red-800 p-2 rounded"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
