/*
  Warnings:

  - You are about to drop the column `published` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `isCaptain` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `isApplied` on the `TeamMember` table. All the data in the column will be lost.
  - Added the required column `status` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TeamMemberStatus" AS ENUM ('APPLIED', 'MEMBER', 'CAPTAIN');

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "published";

-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "isCaptain",
DROP COLUMN "isApplied",
ADD COLUMN     "status" "TeamMemberStatus" NOT NULL;

-- AlterTable
ALTER TABLE "TrainingSession" ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false;
