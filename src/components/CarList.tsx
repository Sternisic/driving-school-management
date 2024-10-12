'use client';

import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Car } from '@/types/Car';

interface CarListProps {
  cars: Car[];
  onEdit: (car: Car) => void;
  onDelete: (id: number) => void;
}

const CarList: React.FC<CarListProps> = ({ cars, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white shadow-md rounded">
      <thead>
        <tr>
          <th className="p-4 bg-primary text-white">Marke</th>
          <th className="p-4 bg-primary text-white">Modell</th>
          <th className="p-4 bg-primary text-white">Kennzeichen</th>
          <th className="p-4 bg-primary text-white">Schalt/Automatik</th>
          <th className="p-4 bg-primary text-white">Aktionen</th>
        </tr>
      </thead>
      <tbody>
        {cars.map((car) => (
          <tr key={car.id}>
            <td className="p-4 border-t text-black">{car.brand}</td>
            <td className="p-4 border-t text-black">{car.model}</td>
            <td className="p-4 border-t text-black">{car.licensePlate}</td>
            <td className="p-4 border-t text-black">{car.gearType}</td>
            <td className="p-4 border-t flex justify-end space-x-4">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => onEdit(car)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => car.id && onDelete(car.id)}
              >
                <FaTrashAlt />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CarList;
