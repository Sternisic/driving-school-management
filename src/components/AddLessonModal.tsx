import { useState } from 'react';

const AddLessonModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (lesson: any) => void }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [lessonType, setLessonType] = useState('Normalfahrt');

    const handleSubmit = () => {
        onSave({ date, time, lessonType });
        onClose(); // Modal schließen nach dem Speichern
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl mb-4">Fahrstunde hinzufügen</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Datum:</label>
                    <input
                        type="date"
                        className="border rounded w-full p-2"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Uhrzeit:</label>
                    <input
                        type="time"
                        className="border rounded w-full p-2"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Art der Fahrt:</label>
                    <select
                        className="border rounded w-full p-2"
                        value={lessonType}
                        onChange={(e) => setLessonType(e.target.value)}
                    >
                        <option value="Normalfahrt">Normalfahrt</option>
                        <option value="Sonderfahrt">Sonderfahrt</option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
                        Abbrechen
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                        Speichern
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddLessonModal;
