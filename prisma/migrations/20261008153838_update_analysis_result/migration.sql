/*
  Warnings:

  - You are about to drop the column `improvements` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `missingSkills` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `strongMatches` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Analysis` table. All the data in the column will be lost.
  - Added the required column `result` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "improvements",
DROP COLUMN "missingSkills",
DROP COLUMN "strongMatches",
DROP COLUMN "summary",
ADD COLUMN     "result" JSONB NOT NULL;
