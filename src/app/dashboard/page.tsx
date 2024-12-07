import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/options";
import { redirect } from "next/navigation";

interface School {
  id: number;
  name: string;
  image: string;
}

const mockSchools: School[] = [
  { id: 1, name: "Fahrschule Mariendorf", image: "/images/mariendorf.jpg" },
  { id: 2, name: "Fahrschule Aydin (Urbanstraße)", image: "/images/aydin.jpg" },
  { id: 3, name: "Fahrschule Aydin (Gneisennaustraße)", image: "/images/aydin2.jpg" }
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Benutzer ohne Session umleiten
  if (!session) {
    redirect("/");
  }

  // Berechne die Anzahl der Spalten basierend auf der Anzahl der Schulen
  const columns = mockSchools.length === 2 ? "repeat(2, 1fr)" : "repeat(3, 1fr)";

  return (
    <div className="flex items-center justify-center h-auto">
      <div className="w-full max-w-5xl px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Willkommen im Dashboard!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Wählen Sie eine Fahrschule, um fortzufahren:
        </p>
        {/* Dynamisches Grid mit anpassbarer Anzahl von Spalten */}
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: columns }}
        >
          {mockSchools.map((school) => (
            <div
              key={school.id}
              className="transition-transform transform hover:scale-105 hover:shadow-xl bg-white rounded-lg overflow-hidden shadow-md flex flex-col"
            >
              <img
                src={school.image}
                alt={school.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-grow">
                <h2 className="text-xl font-semibold text-gray-800">{school.name}</h2>
              </div>
              <div className="p-4">
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none transition-all">
                  Daten aufrufen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
