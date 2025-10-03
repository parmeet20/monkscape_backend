/*
  Warnings:

  - Added the required column `reserved` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seats` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketPrice` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "reserved" INTEGER NOT NULL,
ADD COLUMN     "seats" INTEGER NOT NULL,
ADD COLUMN     "ticketPrice" INTEGER NOT NULL;
