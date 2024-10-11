mkdir -p src/app/dashboard/students/id src/app/dashboard/instructors src/app/dashboard/cars src/app/bookings
mkdir -p src/app/api/students src/app/api/instructors src/app/api/cars src/app/api/bookings
mkdir -p src/components src/services src/styles

# Erstelle Beispiel-Seiten
touch src/app/dashboard/layout.tsx
touch src/app/dashboard/page.tsx
touch src/app/dashboard/students/page.tsx
touch src/app/dashboard/students/id/page.tsx
touch src/app/dashboard/instructors/page.tsx
touch src/app/dashboard/cars/page.tsx

touch src/app/bookings/layout.tsx
touch src/app/bookings/page.tsx

# Erstelle API-Routen
touch src/app/api/students/route.ts
touch src/app/api/instructors/route.ts
touch src/app/api/cars/route.ts
touch src/app/api/bookings/route.ts

# Erstelle Komponenten
touch src/components/StudentForm.tsx
touch src/components/InstructorForm.tsx
touch src/components/CarForm.tsx
touch src/components/BookingCalendar.tsx
touch src/components/Navbar.tsx

# Erstelle Services
touch src/services/api.ts
touch src/services/studentService.ts
touch src/services/instructorService.ts
touch src/services/carService.ts
touch src/services/bookingService.ts

# Erstelle globale Styles
touch src/styles/globals.css

echo "Projektstruktur erfolgreich erstellt!"
