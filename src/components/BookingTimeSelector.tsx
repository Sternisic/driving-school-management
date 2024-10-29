// components/BookingTimeSelector.tsx
interface BookingTimeSelectorProps {
    date: string;
    startTime: string;
    endTime: string;
    onDateChange: (value: string) => void;
    onStartTimeChange: (value: string) => void;
    onEndTimeChange: (value: string) => void;
  }
  
  export default function BookingTimeSelector({
    date,
    startTime,
    endTime,
    onDateChange,
    onStartTimeChange,
    onEndTimeChange,
  }: BookingTimeSelectorProps) {
    return (
      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <label className="block text-black text-sm font-bold mb-2">Datum</label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-black text-sm font-bold mb-2">Startzeit</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-black text-sm font-bold mb-2">Endzeit</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      </div>
    );
  }
  