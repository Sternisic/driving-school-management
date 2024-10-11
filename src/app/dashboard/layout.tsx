import Navbar from '@/components/Navbar'; // Passe den Pfad an, falls erforderlich

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar /> {/* Navigationsleiste */}
            <main className="flex-1 p-6 bg-gray-50">
                {children} {/* Seiteninhalt */}
            </main>
        </div>
    );
}
