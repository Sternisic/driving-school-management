# Driving School Management System

This project is a management system for driving schools, allowing for the management of students, instructors, cars, and bookings. The system is built with Next.js, Prisma, and a PostgreSQL database.

## Technologies

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Prisma ORM, PostgreSQL
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL

## Features

- **Student Management:** Add, edit, and delete students with fields like first name, last name, phone number, email, address, manual/automatic gearbox, and driving lessons.
- **Instructor Management:** Manage instructors with fields like first name, last name, and phone number.
- **Car Management:** Add, edit, and delete cars with fields like brand, model, license plate, and gearbox type.
- **Booking System:** Manage driving lessons and special trips (e.g., highway, country road).

## Project Structure

src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Layout for the dashboard
│   │   ├── page.tsx                 # Main dashboard page
│   │   ├── students/
│   │   │   ├── page.tsx             # Students page
│   │   │   └── [id]/                # Dynamic routes for individual student
│   │   │       └── page.tsx         # Student details page (for edit/delete)
│   │   ├── instructors/
│   │   │   ├── page.tsx             # Instructors page
│   │   │   └── [id]/                # Dynamic routes for individual instructor
│   │   │       └── page.tsx         # Instructor details page (for edit/delete)
│   │   └── cars/
│   │       ├── page.tsx             # Cars page
│   │       └── [id]/                # Dynamic routes for individual car
│   │           └── page.tsx         # Car details page (for edit/delete)
│   └── api/
│       ├── students/                # API routes for students
│       │   ├── route.ts             # GET/POST/DELETE/PUT for students
│       │   └── [id]/                # API routes for individual student
│       │       └── route.ts         # DELETE/PUT for a specific student
│       ├── instructors/             # API routes for instructors
│       │   ├── route.ts             # GET/POST/DELETE/PUT for instructors
│       │   └── [id]/                # API routes for individual instructor
│       │       └── route.ts         # DELETE/PUT for a specific instructor
│       └── cars/                    # API routes for cars
│           ├── route.ts             # GET/POST/DELETE/PUT for cars
│           └── [id]/                # API routes for individual car
│               └── route.ts         # DELETE/PUT for a specific car
├── components/
│   ├── StudentForm.tsx              # Form component for adding/editing a student
│   ├── InstructorForm.tsx           # Form component for adding/editing an instructor
│   ├── CarForm.tsx                  # Form component for adding/editing a car
│   ├── Modal.tsx                    # Modal component for forms
│   ├── StudentList.tsx              # Component displaying the list of students
│   ├── InstructorList.tsx           # Component displaying the list of instructors
│   ├── CarList.tsx                  # Component displaying the list of cars
│   └── Navbar.tsx                   # Navigation bar component
├── services/
│   ├── api.ts                       # Common API utility functions
│   ├── studentService.ts            # Service for interacting with the students API
│   ├── instructorService.ts         # Service for interacting with the instructors API
│   ├── carService.ts                # Service for interacting with the cars API
├── types/
│   ├── Student.ts                   # Type definitions for Student model
│   ├── Instructor.ts                # Type definitions for Instructor model
│   └── Car.ts                       # Type definitions for Car model
├── prisma/
│   ├── schema.prisma                # Prisma schema file defining the database models
├── styles/
│   └── globals.css                  # Global styles for Tailwind CSS
├── scripts/
│   └── createDatabase.js            # Script for automatically creating the database
├── .env                             # Environment variables for database connection
└── README.md                        # Project documentation and instructions


## Installation

### Prerequisites

- Node.js (Version 18 or higher)
- PostgreSQL
- Prisma CLI (installed automatically)

### Step 1: Clone the Repository

git clone https://github.com/your-username/driving-school-management.git
cd driving-school-management
Step 2: Install Dependencies
```bash
npm install
```
Step 3: Database Setup
Option 1: Using Script (Recommended)
This project includes a script that automatically sets up the PostgreSQL database and runs Prisma migrations. You can execute the script with:
```bash
npm run setup
```
This command will:

## Create the PostgreSQL database.
Run Prisma migrations to set up the database schema.
Seed the database with initial data (if applicable).
Make sure you have PostgreSQL installed and running. The database URL is configured in the .env file.

Option 2: Manual Setup
Create a PostgreSQL database manually.
Update the .env file with your database connection string:
DATABASE_URL="postgresql://user:password@localhost:5432/driving_school_db"
Run the following command to apply the database schema:
```bash
npx prisma migrate dev --name init
```
Step 4: Start the Development Server
```bash
npm run dev
```
Your development server should now be running at http://localhost:3000.

## Usage
Add Students: Go to the dashboard, select "Students," and click "Add Student." Fill in the required fields and save.
Manage Instructors: Go to the instructors section to add, edit, or delete instructors.
Manage Cars: Go to the cars section to add, edit, or delete cars.
Database Management
This system uses Prisma to manage the PostgreSQL database. Below are some useful commands:

Run migrations:
```bash
npx prisma migrate dev --name <migration-name>
```
Open Prisma Studio to manage the database visually:
```bash
npx prisma studio
```

## Error Handling
Database Connection Issues
If you encounter connection issues, ensure that the DATABASE_URL is correct in your .env file and that PostgreSQL is running.

## Prisma Migrations
If you experience migration issues, delete the prisma/migrations directory and re-run the migrations:
```bash
npx prisma migrate dev --name init
```

## License
This project is licensed under the MIT License.