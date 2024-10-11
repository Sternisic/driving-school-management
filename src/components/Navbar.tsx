const Navbar = () => {
    return (
        <nav className="bg-primary text-white p-4">
            <ul className="flex space-x-4">
                <li>
                    <a href="/dashboard/students" className="hover:bg-red-800 p-2 rounded">Fahrschüler</a>
                </li>
                <li>
                    <a href="/dashboard/instructors" className="hover:bg-red-800 p-2 rounded">Fahrlehrer</a>
                </li>
                <li>
                    <a href="/dashboard/cars" className="hover:bg-red-800 p-2 rounded">Autos</a>
                </li>
                <li>
                    <a href="/dashboard/bookings" className="hover:bg-red-800 p-2 rounded">Kalender</a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
