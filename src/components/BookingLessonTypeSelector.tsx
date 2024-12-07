// components/BookingLessonTypeSelector.tsx
interface BookingLessonTypeSelectorProps {
  lessonType: 'NORMAL' | 'LANDSTRASSE' | 'AUTOBAHN' | 'DAEMMERUNG';
  onLessonTypeChange: (value: 'NORMAL' | 'LANDSTRASSE' | 'AUTOBAHN' | 'DAEMMERUNG') => void;
  availableLessonTypes: { value: 'NORMAL' | 'LANDSTRASSE' | 'AUTOBAHN' | 'DAEMMERUNG'; label: string }[];
}

export default function BookingLessonTypeSelector({
  lessonType,
  onLessonTypeChange,
  availableLessonTypes,
}: BookingLessonTypeSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-black text-sm font-bold mb-2">Art der Fahrstunde</label>
      <select
        value={lessonType}
        onChange={(e) => onLessonTypeChange(e.target.value as 'NORMAL' | 'LANDSTRASSE' | 'AUTOBAHN' | 'DAEMMERUNG')}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      >
        {availableLessonTypes.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
