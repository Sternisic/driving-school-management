import { Instructor } from "@/types/Instructor";

// Farben für die Fahrlehrer
const instructorColors = [
  "#FFB6C1",
  "#ADD8E6",
  "#98FB98",
  "#FFDAB9",
  "#E6E6FA",
  "#F5DEB3",
  "#FFFACD",
];

// Funktion, um Farbe basierend auf dem Fahrlehrer zu holen
export const getInstructorColor = (instructorId: number, instructors: Instructor[]) => {
  const index = instructors.findIndex((inst) => inst.id === instructorId);
  return instructorColors[index % instructorColors.length];
};

export const eventStyleGetter = (event: Booking, instructors: Instructor[]) => {
  const instructorColor = getInstructorColor(event.instructorId, instructors);
  
  const style = {
    backgroundColor: instructorColor,
    borderRadius: "5px",
    opacity: 0.8,
    color: "black",
    border: "0px",
    display: "block",
    backgroundImage: event.paid
      ? `repeating-linear-gradient(
          45deg,
          ${instructorColor},
          ${instructorColor} 10px,
          rgba(255, 255, 255, 0.3) 10px,
          rgba(255, 255, 255, 0.3) 20px
        )`
      : undefined,
    backgroundSize: "100%",
    backgroundRepeat: "repeat",
  };

  return { style };
};
