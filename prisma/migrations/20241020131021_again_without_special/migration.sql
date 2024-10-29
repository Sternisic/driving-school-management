/*
  Warnings:

  - You are about to drop the column `specialTrips` on the `Booking` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SpecialTrips" AS ENUM ('LANDSTRASSE', 'AUTOBAHN', 'DAEMMERUNG');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "specialTrips";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "specialTrips" DROP DEFAULT;
