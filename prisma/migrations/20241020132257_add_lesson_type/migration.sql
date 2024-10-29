/*
  Warnings:

  - Added the required column `lessonType` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('NORMAL', 'LANDSTRASSE', 'AUTOBAHN', 'DAEMMERUNG');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "lessonType" "LessonType" NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "lessons" SET DEFAULT 0,
ALTER COLUMN "specialTrips" SET DEFAULT '{}';
