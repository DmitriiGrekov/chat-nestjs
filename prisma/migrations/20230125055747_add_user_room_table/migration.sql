/*
  Warnings:

  - You are about to drop the column `roomId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_RoomToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roomId";

-- DropTable
DROP TABLE "_RoomToUser";

-- CreateTable
CREATE TABLE "UserRoom" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "roomId" INTEGER,

    CONSTRAINT "UserRoom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRoom" ADD CONSTRAINT "UserRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoom" ADD CONSTRAINT "UserRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
