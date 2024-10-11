'use client';

const StudentForm = () => {
    return (
        <form className="bg-white shadow-md rounded p-6">
            <div className="mb-4">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="name">
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    placeholder="Name eingeben"
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-black text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email eingeben"
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <button
                type="submit"
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
            >
                Fahrschüler hinzufügen
            </button>
        </form>
    );
};

export default StudentForm;
