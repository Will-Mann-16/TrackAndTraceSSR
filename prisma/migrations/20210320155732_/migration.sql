/*
  Warnings:

  - You are about to drop the column `title` on the `Fixture` table. All the data in the column will be lost.
  - Added the required column `opponent` to the `Fixture` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `TrainingSession` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Fixture" DROP COLUMN "title",
ADD COLUMN     "opponent" TEXT NOT NULL,
ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "TrainingSession" ALTER COLUMN "title" SET NOT NULL;
