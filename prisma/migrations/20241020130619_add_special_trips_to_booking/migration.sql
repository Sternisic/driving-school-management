-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "specialTrips" JSONB NOT NULL DEFAULT '{}',
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "specialTrips" SET DEFAULT '{}';

-- DropEnum
DROP TYPE "SpecialTrips";
