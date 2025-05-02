-- CreateEnum
CREATE TYPE "EventAction" AS ENUM ('ON', 'OFF');

-- CreateEnum
CREATE TYPE "Reason" AS ENUM ('MANUAL', 'MICROCONTROLLER_DIED', 'AUTOMATIC', 'WEATHER');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "SprinklerSchedule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "daysOfWeek" "DayOfWeek"[],
    "timeOfDay" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "SprinklerSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprinklerEvent" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "action" "EventAction" NOT NULL,
    "reason" "Reason" NOT NULL,
    "duration" INTEGER,
    "scheduleId" INTEGER,

    CONSTRAINT "SprinklerEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SprinklerEvent" ADD CONSTRAINT "SprinklerEvent_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "SprinklerSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
