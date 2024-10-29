// components/BookingCarSelector.tsx
import { Car } from "@/types/Car";

interface BookingCarSelectorProps {
  cars: Car[];
  selectedCar: string | number;
  onSelect: (value: string | number) => void;
}

export default function BookingCarSelector({
  cars,
  selectedCar,
  onSelect,
}: BookingCarSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-black text-sm font-bold mb-2">Auto</label>
      <select
        value={selectedCar}
        onChange={(e) => onSelect(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      >
        <option value="">Wähle ein Auto</option>
        {cars.map((car) => (
          <option key={car.id} value={car.id}>
            {car.brand} {car.model} ({car.licensePlate})
          </option>
        ))}
      </select>
    </div>
  );
}
